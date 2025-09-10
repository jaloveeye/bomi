"use client";

import { Achievement } from "@/constants/level";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementNotification({
  achievement,
  onClose,
}: AchievementNotificationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-pulse">
        <div className="text-6xl mb-4 animate-bounce">{achievement.emoji}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">성취 달성!</h2>
        <h3 className="text-2xl font-semibold text-yellow-600 mb-2">
          {achievement.name}
        </h3>
        <p className="text-gray-600 mb-6">{achievement.description}</p>
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-6">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            🏆 새로운 배지 획득!
          </div>
          <div className="text-sm text-gray-600">
            계속해서 더 많은 성취를 달성해보세요!
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
        >
          확인
        </button>
      </div>
    </div>
  );
}
