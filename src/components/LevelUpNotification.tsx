"use client";

import { LEVELS } from "@/constants/level";

interface LevelUpNotificationProps {
  newLevel: number;
  onClose: () => void;
}

export default function LevelUpNotification({
  newLevel,
  onClose,
}: LevelUpNotificationProps) {
  const levelData = LEVELS.find((level) => level.level === newLevel);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce">
        <div className="text-6xl mb-4">{levelData?.emoji}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">레벨업!</h2>
        <h3 className="text-2xl font-semibold text-blue-600 mb-2">
          레벨 {newLevel} - {levelData?.name}
        </h3>
        <p className="text-gray-600 mb-6">{levelData?.description}</p>
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 mb-6">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            🎉 축하합니다!
          </div>
          <div className="text-sm text-gray-600">
            더 많은 문제를 풀어서 다음 레벨로 올라가보세요!
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
        >
          계속하기
        </button>
      </div>
    </div>
  );
}
