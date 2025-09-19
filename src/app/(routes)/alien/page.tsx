"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AlienGamePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="w-full max-w-2xl text-center">
        <Link
          href="/"
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">메인으로</span>
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          🔢 숫자 외계인 게임
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          다가오는 벽이 닿기 전에 숫자 외계인을 정답 모양으로 변신시키세요!
        </p>

        {/* 게임 설명 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🎮 게임 방법</h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <strong>문제 확인:</strong> 정면에서 다가오는 벽에 표시된 수학
                문제를 확인하세요
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <strong>숫자 변신:</strong> 0~9 프리셋 버튼으로 숫자 외계인을
                정답 모양으로 변신시키세요
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <strong>벽과 충돌:</strong> 벽이 외계인에게 닿으면 자동으로
                정답을 확인합니다
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <strong>결과:</strong> 정답이면 벽이 통과하고, 오답이면 벽에
                부딪혀 게임 오버!
              </div>
            </div>
          </div>
        </div>

        {/* 게임 시작 버튼 */}
        <Link
          href="/alien/play"
          className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl text-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🚀 게임 시작하기
        </Link>
      </div>
    </div>
  );
}
