"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type PatternType = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  difficulty: "easy" | "medium" | "hard";
  href: string;
  unlocked: boolean;
};

const patternTypes: PatternType[] = [
  {
    id: "addition-pattern",
    title: "덧셈 패턴",
    description: "2씩 더하기, 5씩 더하기 패턴을 찾아보세요!",
    emoji: "➕",
    difficulty: "easy",
    href: "/pattern/addition",
    unlocked: true,
  },
  {
    id: "subtraction-pattern",
    title: "뺄셈 패턴",
    description: "2씩 빼기, 5씩 빼기 패턴을 찾아보세요!",
    emoji: "➖",
    difficulty: "easy",
    href: "/pattern/subtraction",
    unlocked: true,
  },
  {
    id: "mixed-pattern",
    title: "섞인 패턴",
    description: "덧셈과 뺄셈이 섞인 복잡한 패턴!",
    emoji: "🔄",
    difficulty: "medium",
    href: "/pattern/mixed",
    unlocked: true,
  },
  {
    id: "number-sequence",
    title: "숫자 순서",
    description: "숫자들의 규칙을 찾아보세요!",
    emoji: "🔢",
    difficulty: "hard",
    href: "/pattern/sequence",
    unlocked: true,
  },
];

export default function PatternPage() {
  const [selectedPattern, setSelectedPattern] = useState<PatternType | null>(
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
            🔍 패턴 찾기 게임
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            숫자들의 규칙을 찾아서 다음 숫자를 맞춰보세요!
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

        {/* 패턴 타입들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {patternTypes.map((pattern) => (
            <div
              key={pattern.id}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-300 ${
                pattern.unlocked
                  ? "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer"
                  : "bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed"
              }`}
              onClick={() => pattern.unlocked && setSelectedPattern(pattern)}
            >
              {/* 난이도 배지 */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(
                    pattern.difficulty
                  )}`}
                >
                  {getDifficultyText(pattern.difficulty)}
                </span>
              </div>

              {/* 패턴 정보 */}
              <div className="text-center">
                <div className="text-6xl mb-4">{pattern.emoji}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  {pattern.title}
                </h3>
                <p className="text-gray-600 mb-4">{pattern.description}</p>

                {pattern.unlocked ? (
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

        {/* 선택된 패턴 상세 정보 */}
        {selectedPattern && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="text-8xl mb-4">{selectedPattern.emoji}</div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  {selectedPattern.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {selectedPattern.description}
                </p>

                <div className="mb-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${getDifficultyColor(
                      selectedPattern.difficulty
                    )}`}
                  >
                    난이도: {getDifficultyText(selectedPattern.difficulty)}
                  </span>
                </div>

                <div className="flex gap-4">
                  <Link
                    href={selectedPattern.href}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    게임 시작하기
                  </Link>
                  <button
                    onClick={() => setSelectedPattern(null)}
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
