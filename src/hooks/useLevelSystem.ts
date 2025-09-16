"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserProgress,
  Achievement,
  ACHIEVEMENTS,
  calculateExp,
  calculateLevel,
  getExpToNextLevel,
  getLevelProgress,
} from "@/constants/level";

const STORAGE_KEY = "bomi_user_progress";

// 초기 사용자 진행도
const getInitialProgress = (): UserProgress => ({
  level: 1,
  experience: 0,
  totalCorrectAnswers: 0,
  totalGamesPlayed: 0,
  achievements: ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: false,
  })),
  gameStats: {},
});

export const useLevelSystem = () => {
  const [userProgress, setUserProgress] =
    useState<UserProgress>(getInitialProgress);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(
    null
  );

  // 로컬 스토리지에서 진행도 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProgress(parsed);
      }
    } catch (error) {
      console.error("진행도 로드 실패:", error);
    }
  }, []);

  // 진행도 저장
  const saveProgress = useCallback((progress: UserProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("진행도 저장 실패:", error);
    }
  }, []);

  // 진행도 업데이트 (현재 사용하지 않음)
  // const updateProgress = useCallback((newProgress: UserProgress) => {
  //   setUserProgress(newProgress);
  //   saveProgress(newProgress);
  // }, [saveProgress]);

  // 성취 체크
  const checkAchievements = useCallback(
    (progress: UserProgress) => {
      const newAchievements: Achievement[] = [];

      progress.achievements.forEach((achievement) => {
        if (achievement.unlocked) return;

        let shouldUnlock = false;

        switch (achievement.condition.type) {
          case "correct_answers":
            if (achievement.condition.gameType) {
              const gameStats =
                progress.gameStats[achievement.condition.gameType];
              shouldUnlock =
                gameStats?.correctAnswers >= achievement.condition.value;
            } else {
              shouldUnlock =
                progress.totalCorrectAnswers >= achievement.condition.value;
            }
            break;

          case "consecutive_correct":
            // 연속 정답은 별도 추적 필요 (현재는 간단히 처리)
            shouldUnlock =
              progress.totalCorrectAnswers >= achievement.condition.value;
            break;

          case "perfect_score":
            // 완벽한 점수는 게임 완료 시 체크
            shouldUnlock = false; // 게임별로 별도 처리
            break;

          case "games_completed":
            shouldUnlock =
              progress.totalGamesPlayed >= achievement.condition.value;
            break;

          case "level_reached":
            shouldUnlock = progress.level >= achievement.condition.value;
            break;
        }

        if (shouldUnlock) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: Date.now(),
          };
          newAchievements.push(unlockedAchievement);

          // 성취 알림 표시
          setTimeout(() => setShowAchievement(unlockedAchievement), 1000);
        }
      });

      if (newAchievements.length > 0) {
        setUserProgress((prev) => {
          const newProgress = {
            ...prev,
            achievements: prev.achievements.map((achievement) => {
              const newAchievement = newAchievements.find(
                (a) => a.id === achievement.id
              );
              return newAchievement || achievement;
            }),
          };

          // 로컬 스토리지에 저장
          saveProgress(newProgress);

          return newProgress;
        });
      }
    },
    [setShowAchievement, saveProgress]
  );

  // 문제 정답 처리
  const handleCorrectAnswer = useCallback(
    (gameType: string, difficulty: "easy" | "medium" | "hard" = "easy") => {
      setUserProgress((prev) => {
        const expGained = calculateExp(true, difficulty);
        const newExp = prev.experience + expGained;
        const newLevel = calculateLevel(newExp);
        const oldLevel = prev.level;

        const newProgress: UserProgress = {
          ...prev,
          experience: newExp,
          level: newLevel,
          totalCorrectAnswers: prev.totalCorrectAnswers + 1,
          gameStats: {
            ...prev.gameStats,
            [gameType]: {
              ...prev.gameStats[gameType],
              correctAnswers:
                (prev.gameStats[gameType]?.correctAnswers || 0) + 1,
              totalAnswers: (prev.gameStats[gameType]?.totalAnswers || 0) + 1,
            },
          },
        };

        // 로컬 스토리지에 저장
        saveProgress(newProgress);

        // 레벨업 체크
        if (newLevel > oldLevel) {
          setTimeout(() => setShowLevelUp(true), 500);
        }

        // 성취 체크
        checkAchievements(newProgress);

        return newProgress;
      });
    },
    [checkAchievements, saveProgress]
  );

  // 문제 오답 처리
  const handleIncorrectAnswer = useCallback(
    (gameType: string) => {
      setUserProgress((prev) => {
        const newProgress = {
          ...prev,
          gameStats: {
            ...prev.gameStats,
            [gameType]: {
              ...prev.gameStats[gameType],
              totalAnswers: (prev.gameStats[gameType]?.totalAnswers || 0) + 1,
            },
          },
        };

        // 로컬 스토리지에 저장
        saveProgress(newProgress);

        return newProgress;
      });
    },
    [saveProgress]
  );

  // 게임 완료 처리
  const handleGameComplete = useCallback(
    (gameType: string, score: number) => {
      setUserProgress((prev) => {
        const newProgress: UserProgress = {
          ...prev,
          totalGamesPlayed: prev.totalGamesPlayed + 1,
          gameStats: {
            ...prev.gameStats,
            [gameType]: {
              ...prev.gameStats[gameType],
              bestScore: Math.max(
                prev.gameStats[gameType]?.bestScore || 0,
                score
              ),
              gamesPlayed: (prev.gameStats[gameType]?.gamesPlayed || 0) + 1,
            },
          },
        };

        // 로컬 스토리지에 저장
        saveProgress(newProgress);

        // 성취 체크
        checkAchievements(newProgress);

        return newProgress;
      });
    },
    [checkAchievements, saveProgress]
  );

  // 완벽한 점수 성취 체크
  const checkPerfectScore = useCallback(
    (score: number, totalQuestions: number) => {
      if (score === totalQuestions && totalQuestions >= 10) {
        setUserProgress((prev) => {
          const perfectAchievement = prev.achievements.find(
            (a) => a.id === "perfect_10"
          );
          if (perfectAchievement && !perfectAchievement.unlocked) {
            const unlockedAchievement = {
              ...perfectAchievement,
              unlocked: true,
              unlockedAt: Date.now(),
            };

            setTimeout(() => setShowAchievement(unlockedAchievement), 1000);

            const newProgress = {
              ...prev,
              achievements: prev.achievements.map((a) =>
                a.id === "perfect_10" ? unlockedAchievement : a
              ),
            };

            // 로컬 스토리지에 저장
            saveProgress(newProgress);

            return newProgress;
          }
          return prev;
        });
      }
    },
    [saveProgress]
  );

  // 레벨업 알림 닫기
  const closeLevelUp = useCallback(() => {
    setShowLevelUp(false);
  }, []);

  // 성취 알림 닫기
  const closeAchievement = useCallback(() => {
    setShowAchievement(null);
  }, []);

  // 진행도 리셋
  const resetProgress = useCallback(() => {
    const initialProgress = getInitialProgress();
    setUserProgress(initialProgress);
    saveProgress(initialProgress);
  }, [saveProgress]);

  return {
    userProgress,
    showLevelUp,
    showAchievement,
    handleCorrectAnswer,
    handleIncorrectAnswer,
    handleGameComplete,
    checkPerfectScore,
    closeLevelUp,
    closeAchievement,
    resetProgress,
    getExpToNextLevel: () => getExpToNextLevel(userProgress.experience),
    getLevelProgress: () => getLevelProgress(userProgress.experience),
  };
};
