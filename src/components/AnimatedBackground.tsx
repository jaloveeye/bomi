"use client";

import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 배경 장식 요소들 */}
      <div className="absolute top-20 left-10 animate-pulse">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-60"></div>
      </div>

      <div className="absolute top-40 right-20 animate-bounce">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-50"></div>
      </div>

      <div className="absolute bottom-40 left-20 animate-ping">
        <div className="w-8 h-8 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-40"></div>
      </div>

      {/* 수학 기호들이 떠다니는 효과 */}
      <div className="absolute top-32 left-1/4 animate-math-float-1">
        <div className="text-4xl text-pink-300 opacity-30 font-bold">+</div>
      </div>

      <div className="absolute top-60 right-1/3 animate-math-float-2">
        <div className="text-3xl text-blue-300 opacity-30 font-bold">-</div>
      </div>

      <div className="absolute bottom-60 left-1/3 animate-math-float-3">
        <div className="text-3xl text-green-300 opacity-30 font-bold">×</div>
      </div>
    </div>
  );
}
