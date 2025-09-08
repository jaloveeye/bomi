"use client";

import { useEffect, useState } from "react";

type ScoreData = {
  id: number;
  name: string;
  score: number;
  gameType: string;
  date: string;
  timestamp: number;
};

export default function ScoreList() {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const savedScores = localStorage.getItem("mathGameScores");
    if (savedScores) {
      const parsedScores = JSON.parse(savedScores);
      setScores(parsedScores);
    }
  }, []);

  const displayScores = showAll ? scores : scores.slice(0, 5);

  if (scores.length === 0) {
    return (
      <div className="mt-8 p-4 md:p-6 rounded-2xl border border-[#bfe7c8] bg-[#e7f7ea]">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">🏆 점수 기록</h2>
        <p className="text-base md:text-lg text-gray-600">
          아직 기록된 점수가 없어요. 게임을 해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 md:p-6 rounded-2xl border border-[#bfe7c8] bg-[#e7f7ea]">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">🏆 점수 기록</h2>
      <div className="space-y-2 md:space-y-3">
        {displayScores.map((score, index) => (
          <div
            key={score.id}
            className={`flex items-center justify-between p-3 md:p-4 rounded-xl ${
              index === 0
                ? "bg-yellow-100 border-2 border-yellow-300"
                : index === 1
                ? "bg-gray-100 border-2 border-gray-300"
                : index === 2
                ? "bg-orange-100 border-2 border-orange-300"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <div className="text-lg md:text-2xl font-bold flex-shrink-0">
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : `${index + 1}위`}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-base md:text-lg truncate">{score.name}</div>
                <div className="text-xs md:text-sm text-gray-600 truncate">{score.gameType}</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <div className="text-lg md:text-xl font-bold text-blue-600">
                {score.score}점
              </div>
              <div className="text-xs text-gray-500 hidden md:block">{score.date}</div>
            </div>
          </div>
        ))}
      </div>

      {scores.length > 5 && (
        <button
          className="w-full mt-4 h-12 rounded-xl text-lg font-bold kid-button border border-black/10 bg-white active:scale-[.98]"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "간단히 보기" : `전체 보기 (${scores.length}개)`}
        </button>
      )}
    </div>
  );
}
