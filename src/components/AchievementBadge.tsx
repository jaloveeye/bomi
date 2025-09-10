"use client";

import { Achievement } from "@/constants/level";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "small" | "medium" | "large";
  showDescription?: boolean;
}

export default function AchievementBadge({
  achievement,
  size = "medium",
  showDescription = false,
}: AchievementBadgeProps) {
  const sizeClasses = {
    small: "w-12 h-12 text-lg",
    medium: "w-16 h-16 text-2xl",
    large: "w-20 h-20 text-3xl",
  };

  const textSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <div
      className={`flex flex-col items-center ${showDescription ? "mb-2" : ""}`}
    >
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full flex items-center justify-center shadow-lg transition-all duration-300
          ${
            achievement.unlocked
              ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white animate-pulse"
              : "bg-gray-300 text-gray-500"
          }
        `}
        title={
          achievement.unlocked ? achievement.name : "아직 달성하지 못한 성취"
        }
      >
        {achievement.unlocked ? achievement.emoji : "🔒"}
      </div>

      {showDescription && (
        <div className="text-center mt-2">
          <div
            className={`font-semibold ${textSizeClasses[size]} ${
              achievement.unlocked ? "text-gray-800" : "text-gray-500"
            }`}
          >
            {achievement.name}
          </div>
          <div
            className={`${textSizeClasses[size]} ${
              achievement.unlocked ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {achievement.description}
          </div>
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="text-xs text-gray-500 mt-1">
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
