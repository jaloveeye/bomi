"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ClockPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">홈으로</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">🕐 시계 게임</h1>
        </div>

        {/* 게임 설명 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            시계 게임으로 시간을 배워보세요!
          </h2>
          <p className="text-gray-600 leading-relaxed">
            시계를 보고 시간을 맞추거나, 시간을 보고 시계 바늘을 맞춰보세요.
            시간 개념을 재미있게 배울 수 있어요!
          </p>
        </div>

        {/* 게임 선택 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 시계 보기 게임 */}
          <Link
            href="/clock/read"
            className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🕐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                시계 보기 게임
              </h3>
              <p className="text-gray-600 mb-4">
                시계를 보고 정확한 시간을 맞춰보세요!
              </p>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                💡 시계의 시침과 분침을 잘 보고 시간을 읽어보세요
              </div>
            </div>
          </Link>

          {/* 시계 맞추기 게임 */}
          <Link
            href="/clock/set"
            className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                시계 맞추기 게임
              </h3>
              <p className="text-gray-600 mb-4">
                주어진 시간에 맞게 시계 바늘을 조정해보세요!
              </p>
              <div className="bg-green-50 rounded-lg p-3 text-sm text-green-700">
                💡 시침과 분침을 드래그해서 정확한 시간을 만들어보세요
              </div>
            </div>
          </Link>
        </div>

        {/* 난이도 안내 */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🎯 난이도 안내
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-600 font-semibold mb-2">🟢 쉬움</div>
              <p className="text-sm text-green-700">
                정시 (1시, 2시, 3시...)
                <br />
                30분 단위 (1시 30분, 2시 30분...)
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-yellow-600 font-semibold mb-2">🟡 보통</div>
              <p className="text-sm text-yellow-700">
                15분 단위 (1시 15분, 2시 45분...)
                <br />
                5분 단위 (1시 5분, 2시 25분...)
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-red-600 font-semibold mb-2">🔴 어려움</div>
              <p className="text-sm text-red-700">
                1분 단위 (1시 3분, 2시 17분...)
                <br />
                복잡한 시간 조합
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
