// 레벨 시스템 상수
export interface Level {
  level: number;
  name: string;
  requiredExp: number;
  emoji: string;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: {
    type:
      | "correct_answers"
      | "consecutive_correct"
      | "perfect_score"
      | "games_completed"
      | "level_reached";
    value: number;
    gameType?: string;
  };
  unlocked: boolean;
  unlockedAt?: number;
}

export interface UserProgress {
  level: number;
  experience: number;
  totalCorrectAnswers: number;
  totalGamesPlayed: number;
  achievements: Achievement[];
  gameStats: {
    [gameType: string]: {
      correctAnswers: number;
      totalAnswers: number;
      bestScore: number;
      gamesPlayed: number;
    };
  };
}

// 레벨 정의
export const LEVELS: Level[] = [
  {
    level: 1,
    name: "수학 초보",
    requiredExp: 0,
    emoji: "🌱",
    description: "수학의 첫 걸음을 시작해요!",
  },
  {
    level: 2,
    name: "수학 꿈나무",
    requiredExp: 50,
    emoji: "🌿",
    description: "조금씩 자라나고 있어요!",
  },
  {
    level: 3,
    name: "수학 새싹",
    requiredExp: 120,
    emoji: "🌱",
    description: "새로운 지식을 배우고 있어요!",
  },
  {
    level: 4,
    name: "수학 어린이",
    requiredExp: 220,
    emoji: "👶",
    description: "수학이 재미있어지고 있어요!",
  },
  {
    level: 5,
    name: "수학 학생",
    requiredExp: 350,
    emoji: "🎒",
    description: "열심히 공부하고 있어요!",
  },
  {
    level: 6,
    name: "수학 친구",
    requiredExp: 520,
    emoji: "🤝",
    description: "수학과 친해지고 있어요!",
  },
  {
    level: 7,
    name: "수학 탐험가",
    requiredExp: 720,
    emoji: "🔍",
    description: "새로운 문제를 탐험해요!",
  },
  {
    level: 8,
    name: "수학 마법사",
    requiredExp: 950,
    emoji: "🧙‍♂️",
    description: "수학의 마법을 배우고 있어요!",
  },
  {
    level: 9,
    name: "수학 영웅",
    requiredExp: 1220,
    emoji: "🦸‍♂️",
    description: "수학의 영웅이 되었어요!",
  },
  {
    level: 10,
    name: "수학 박사",
    requiredExp: 1550,
    emoji: "👨‍🎓",
    description: "수학의 박사가 되었어요!",
  },
];

// 성취 정의
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_correct",
    name: "첫 번째 정답",
    description: "첫 번째 문제를 맞혔어요!",
    emoji: "🎉",
    condition: { type: "correct_answers", value: 1 },
    unlocked: false,
  },
  {
    id: "perfect_10",
    name: "완벽한 10점",
    description: "10문제를 모두 맞혔어요!",
    emoji: "💯",
    condition: { type: "perfect_score", value: 10 },
    unlocked: false,
  },
  {
    id: "streak_5",
    name: "5연속 정답",
    description: "5문제를 연속으로 맞혔어요!",
    emoji: "🔥",
    condition: { type: "consecutive_correct", value: 5 },
    unlocked: false,
  },
  {
    id: "streak_10",
    name: "10연속 정답",
    description: "10문제를 연속으로 맞혔어요!",
    emoji: "⚡",
    condition: { type: "consecutive_correct", value: 10 },
    unlocked: false,
  },
  {
    id: "level_5",
    name: "레벨 5 달성",
    description: "레벨 5에 도달했어요!",
    emoji: "⭐",
    condition: { type: "level_reached", value: 5 },
    unlocked: false,
  },
  {
    id: "level_10",
    name: "레벨 10 달성",
    description: "레벨 10에 도달했어요!",
    emoji: "🏆",
    condition: { type: "level_reached", value: 10 },
    unlocked: false,
  },
  {
    id: "games_10",
    name: "10게임 완주",
    description: "10번의 게임을 완주했어요!",
    emoji: "🎮",
    condition: { type: "games_completed", value: 10 },
    unlocked: false,
  },
  {
    id: "addition_master",
    name: "덧셈 마스터",
    description: "덧셈 문제를 50번 맞혔어요!",
    emoji: "➕",
    condition: { type: "correct_answers", value: 50, gameType: "addition" },
    unlocked: false,
  },
  {
    id: "subtraction_master",
    name: "뺄셈 마스터",
    description: "뺄셈 문제를 50번 맞혔어요!",
    emoji: "➖",
    condition: { type: "correct_answers", value: 50, gameType: "subtraction" },
    unlocked: false,
  },
  {
    id: "multiplication_master",
    name: "구구단 마스터",
    description: "구구단 문제를 50번 맞혔어요!",
    emoji: "✖️",
    condition: {
      type: "correct_answers",
      value: 50,
      gameType: "multiplication",
    },
    unlocked: false,
  },
];

// 경험치 계산
export const calculateExp = (
  isCorrect: boolean,
  difficulty: "easy" | "medium" | "hard" = "easy"
): number => {
  if (!isCorrect) return 0;

  const baseExp = {
    easy: 5,
    medium: 8,
    hard: 12,
  };

  return baseExp[difficulty];
};

// 레벨 계산
export const calculateLevel = (experience: number): number => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (experience >= LEVELS[i].requiredExp) {
      return LEVELS[i].level;
    }
  }
  return 1;
};

// 다음 레벨까지 필요한 경험치
export const getExpToNextLevel = (currentExp: number): number => {
  const currentLevel = calculateLevel(currentExp);
  const nextLevel = LEVELS.find((level) => level.level === currentLevel + 1);

  if (!nextLevel) return 0; // 최대 레벨

  return nextLevel.requiredExp - currentExp;
};

// 현재 레벨에서의 진행도 (0-100)
export const getLevelProgress = (currentExp: number): number => {
  const currentLevel = calculateLevel(currentExp);
  const currentLevelData = LEVELS.find((level) => level.level === currentLevel);
  const nextLevelData = LEVELS.find(
    (level) => level.level === currentLevel + 1
  );

  if (!currentLevelData || !nextLevelData) return 100; // 최대 레벨

  const currentLevelExp = currentLevelData.requiredExp;
  const nextLevelExp = nextLevelData.requiredExp;
  const progressExp = currentExp - currentLevelExp;
  const totalExpNeeded = nextLevelExp - currentLevelExp;

  return Math.round((progressExp / totalExpNeeded) * 100);
};
