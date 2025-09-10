"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type StoryChapter = {
  id: number;
  title: string;
  description: string;
  emoji: string;
  difficulty: "easy" | "medium" | "hard";
  href: string;
  unlocked: boolean;
};

const storyChapters: StoryChapter[] = [
  {
    id: 1,
    title: "씨앗의 모험",
    description: "보미가 씨앗을 심어서 꽃을 키우는 이야기예요!",
    emoji: "🌱",
    difficulty: "easy",
    href: "/story/seed",
    unlocked: true,
  },
  {
    id: 2,
    title: "숲속의 친구들",
    description: "숲속에서 만난 동물 친구들과 함께하는 모험!",
    emoji: "🐰",
    difficulty: "easy",
    href: "/story/forest",
    unlocked: true,
  },
  {
    id: 3,
    title: "바다의 보물",
    description: "바다 깊은 곳에 숨겨진 보물을 찾아보세요!",
    emoji: "🐠",
    difficulty: "medium",
    href: "/story/ocean",
    unlocked: true,
  },
  {
    id: 4,
    title: "별나라 여행",
    description: "우주로 떠나는 신비로운 여행!",
    emoji: "⭐",
    difficulty: "hard",
    href: "/story/space",
    unlocked: true,
  },
];

export default function StoryPage() {
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(
    null
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 border-green-300 text-green-800";
      case "medium":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "hard":
        return "bg-red-100 border-red-300 text-red-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "쉬워요";
      case "medium":
        return "보통이에요";
      case "hard":
        return "어려워요";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-6">
      <div className="w-full max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
            🏞️ 보미의 모험 이야기
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            보미와 함께 신나는 모험을 떠나며 수학을 배워보세요!
          </p>
        </div>

        {/* 보미 캐릭터 */}
        <div className="flex justify-center mb-8">
          <div className="animate-float">
            <Image
              src="/bomi-character.png"
              alt="보미 캐릭터"
              width={150}
              height={188}
              className="w-36 h-44 md:w-40 md:h-50 object-cover rounded-2xl shadow-xl"
              style={{
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
              }}
            />
          </div>
        </div>

        {/* 스토리 챕터들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {storyChapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-300 ${
                chapter.unlocked
                  ? "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer"
                  : "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed"
              }`}
              onClick={() => chapter.unlocked && setSelectedChapter(chapter)}
            >
              {/* 난이도 배지 */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(
                    chapter.difficulty
                  )}`}
                >
                  {getDifficultyText(chapter.difficulty)}
                </span>
              </div>

              {/* 챕터 정보 */}
              <div className="text-center">
                <div className="text-6xl mb-4">{chapter.emoji}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {chapter.title}
                </h3>
                <p className="text-gray-600 mb-4">{chapter.description}</p>

                {chapter.unlocked ? (
                  <div className="text-sm text-blue-600 font-medium">
                    클릭해서 시작하기 →
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">🔒 잠금 해제 필요</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 선택된 챕터 상세 정보 */}
        {selectedChapter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="text-8xl mb-4">{selectedChapter.emoji}</div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  {selectedChapter.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {selectedChapter.description}
                </p>

                <div className="mb-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor(
                      selectedChapter.difficulty
                    )}`}
                  >
                    난이도: {getDifficultyText(selectedChapter.difficulty)}
                  </span>
                </div>

                <div className="flex gap-4">
                  <Link
                    href={selectedChapter.href}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    모험 시작하기
                  </Link>
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 뒤로가기 버튼 */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-xl transition-colors"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
