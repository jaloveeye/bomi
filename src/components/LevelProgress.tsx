"use client";

import { UserProgress, LEVELS } from "@/constants/level";

interface LevelProgressProps {
  userProgress: UserProgress;
  showDetails?: boolean;
}

export default function LevelProgress({
  userProgress,
  showDetails = false,
}: LevelProgressProps) {
  const currentLevelData = LEVELS.find(
    (level) => level.level === userProgress.level
  );
  const nextLevelData = LEVELS.find(
    (level) => level.level === userProgress.level + 1
  );

  const progressPercentage = nextLevelData
    ? Math.round(
        ((userProgress.experience - currentLevelData!.requiredExp) /
          (nextLevelData.requiredExp - currentLevelData!.requiredExp)) *
          100
      )
    : 100;

  const expToNext = nextLevelData
    ? nextLevelData.requiredExp - userProgress.experience
    : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
      {/* 현재 레벨 정보 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{currentLevelData?.emoji}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              레벨 {userProgress.level} - {currentLevelData?.name}
            </h3>
            <p className="text-sm text-gray-600">
              {currentLevelData?.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {userProgress.experience}
          </div>
          <div className="text-xs text-gray-500">경험치</div>
        </div>
      </div>

      {/* 진행도 바 */}
      {nextLevelData && (
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>다음 레벨까지</span>
            <span>{expToNext} EXP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* 상세 정보 */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">
              {userProgress.totalCorrectAnswers}
            </div>
            <div className="text-xs text-gray-500">총 정답</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">
              {userProgress.totalGamesPlayed}
            </div>
            <div className="text-xs text-gray-500">완주 게임</div>
          </div>
        </div>
      )}
    </div>
  );
}
