"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useLevelSystem } from "@/hooks/useLevelSystem";

interface ClockTime {
  hour: number;
  minute: number;
}

// 시계 시간 생성 함수
const generateTargetTime = (
  difficulty: "easy" | "medium" | "hard"
): ClockTime => {
  const hour = Math.floor(Math.random() * 12) + 1; // 1-12시

  let minute: number;
  switch (difficulty) {
    case "easy":
      // 정시 또는 30분
      minute = Math.random() < 0.5 ? 0 : 30;
      break;
    case "medium":
      // 15분 단위 또는 5분 단위
      minute =
        Math.random() < 0.5
          ? [0, 15, 30, 45][Math.floor(Math.random() * 4)]
          : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][
              Math.floor(Math.random() * 12)
            ];
      break;
    case "hard":
      // 1분 단위
      minute = Math.floor(Math.random() * 60);
      break;
  }

  return { hour, minute };
};

// 시간을 문자열로 변환
const formatTime = (time: ClockTime): string => {
  const hourStr = time.hour.toString();
  const minuteStr = time.minute.toString().padStart(2, "0");
  return `${hourStr}시 ${minuteStr}분`;
};

// 드래그 가능한 시계 컴포넌트
const DraggableClock = ({
  currentTime,
  onTimeChange,
  disabled,
}: {
  currentTime: ClockTime;
  onTimeChange: (time: ClockTime) => void;
  disabled: boolean;
}) => {
  const clockRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<"hour" | "minute" | null>(null);

  const hourAngle =
    (currentTime.hour % 12) * 30 + (currentTime.minute / 60) * 30;
  const minuteAngle = currentTime.minute * 6;

  // 마우스/터치 이벤트 처리
  const handlePointerDown = (
    e: React.PointerEvent,
    type: "hour" | "minute"
  ) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(type);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !clockRef.current || disabled) return;

      const rect = clockRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const normalizedAngle = (angle + 90 + 360) % 360;

      if (isDragging === "hour") {
        const hour = Math.round(normalizedAngle / 30) % 12;
        const newHour = hour === 0 ? 12 : hour;
        onTimeChange({ ...currentTime, hour: newHour });
      } else if (isDragging === "minute") {
        const minute = Math.round(normalizedAngle / 6) % 60;
        onTimeChange({ ...currentTime, minute });
      }
    },
    [isDragging, currentTime, onTimeChange, disabled]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);

      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* 시계 외곽 */}
      <div
        ref={clockRef}
        className="absolute inset-0 rounded-full border-8 border-gray-800 bg-white shadow-lg"
      >
        {/* 시계 숫자 */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, index) => {
          const angle = index * 30;
          const x = 50 + 35 * Math.sin((angle * Math.PI) / 180);
          const y = 50 - 35 * Math.cos((angle * Math.PI) / 180);

          return (
            <div
              key={num}
              className="absolute text-lg font-bold text-gray-800"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {num}
            </div>
          );
        })}

        {/* 시침 */}
        <div
          className={`absolute w-1 h-16 bg-gray-800 rounded-full origin-bottom cursor-pointer ${
            !disabled ? "hover:bg-blue-600" : ""
          } transition-colors`}
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            transformOrigin: "bottom center",
          }}
          onPointerDown={(e) => handlePointerDown(e, "hour")}
        />

        {/* 분침 */}
        <div
          className={`absolute w-0.5 h-20 bg-gray-800 rounded-full origin-bottom cursor-pointer ${
            !disabled ? "hover:bg-blue-600" : ""
          } transition-colors`}
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            transformOrigin: "bottom center",
          }}
          onPointerDown={(e) => handlePointerDown(e, "minute")}
        />

        {/* 중심점 */}
        <div
          className="absolute w-3 h-3 bg-gray-800 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* 드래그 안내 */}
      {!disabled && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 text-center">
          시침과 분침을 드래그해서 맞춰보세요
        </div>
      )}
    </div>
  );
};

export default function ClockSetPage() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [targetTime, setTargetTime] = useState<ClockTime>({
    hour: 1,
    minute: 0,
  });
  const [currentTime, setCurrentTime] = useState<ClockTime>({
    hour: 1,
    minute: 0,
  });
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null
  );
  const [gameFinished, setGameFinished] = useState(false);

  const { handleCorrectAnswer, handleIncorrectAnswer, checkPerfectScore } =
    useLevelSystem();

  // 새 문제 생성
  const generateNewQuestion = useCallback(() => {
    const newTargetTime = generateTargetTime(difficulty);
    setTargetTime(newTargetTime);
    setCurrentTime({ hour: 1, minute: 0 }); // 초기값
    setShowFeedback(null);
  }, [difficulty]);

  // 게임 시작
  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  // 정답 확인
  const checkAnswer = () => {
    const isCorrect =
      currentTime.hour === targetTime.hour &&
      currentTime.minute === targetTime.minute;

    setTotalQuestions((prev) => prev + 1);
    setShowFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setScore((prev) => prev + 1);
      handleCorrectAnswer("clock_set", difficulty);
    } else {
      handleIncorrectAnswer("clock_set");
    }

    // 1.5초 후 다음 문제
    setTimeout(() => {
      if (totalQuestions + 1 >= 10) {
        setGameFinished(true);
        checkPerfectScore(score + (isCorrect ? 1 : 0), 10);
      } else {
        generateNewQuestion();
      }
    }, 1500);
  };

  // 게임 리셋
  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setGameFinished(false);
    setShowFeedback(null);
    generateNewQuestion();
  };

  if (gameFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/clock"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">시계 게임으로</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              시계 맞추기 게임 완료!
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              게임 완료!
            </h2>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {score} / {totalQuestions}
            </div>
            <p className="text-gray-600 mb-6">
              {score === totalQuestions
                ? "완벽해요! 🏆"
                : score >= totalQuestions * 0.8
                ? "정말 잘했어요! ⭐"
                : score >= totalQuestions * 0.6
                ? "잘했어요! 👍"
                : "다시 도전해보세요! 💪"}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                다시 하기
              </button>
              <Link
                href="/clock"
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                다른 게임
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/clock"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">시계 게임으로</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">시계 맞추기 게임</h1>
        </div>

        {/* 게임 정보 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-gray-800">
              문제 {totalQuestions + 1} / 10
            </div>
            <div className="text-lg font-semibold text-green-600">
              점수: {score}
            </div>
          </div>

          {/* 난이도 선택 */}
          <div className="flex gap-2 mb-4">
            {(["easy", "medium", "hard"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  difficulty === level
                    ? level === "easy"
                      ? "bg-green-500 text-white"
                      : level === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {level === "easy"
                  ? "🟢 쉬움"
                  : level === "medium"
                  ? "🟡 보통"
                  : "🔴 어려움"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 목표 시간 표시 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              이 시간으로 맞춰보세요!
            </h2>
            <div className="text-center">
              <div className="text-6xl mb-4">⏰</div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {formatTime(targetTime)}
              </div>
              <p className="text-gray-600">
                시침과 분침을 드래그해서 정확한 시간을 만들어보세요
              </p>
            </div>
          </div>

          {/* 드래그 가능한 시계 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              시계를 조정하세요
            </h2>
            <DraggableClock
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
              disabled={showFeedback !== null}
            />

            {/* 현재 설정된 시간 표시 */}
            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm text-blue-600 mb-1">
                  현재 설정된 시간
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {formatTime(currentTime)}
                </div>
              </div>
            </div>

            {/* 정답 확인 버튼 */}
            <button
              onClick={checkAnswer}
              disabled={showFeedback !== null}
              className="w-full mt-6 py-4 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {showFeedback === null
                ? "정답 확인"
                : showFeedback === "correct"
                ? "정답! ✅"
                : "틀렸어요 ❌"}
            </button>

            {/* 피드백 */}
            {showFeedback && (
              <div
                className={`mt-4 p-4 rounded-lg text-center ${
                  showFeedback === "correct"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {showFeedback === "correct" ? (
                  <div>
                    <div className="text-lg font-semibold">정답이에요! 🎉</div>
                    <div className="text-sm">정확한 시간을 맞췄어요!</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-semibold">틀렸어요 😅</div>
                    <div className="text-sm">
                      목표: {formatTime(targetTime)}
                    </div>
                    <div className="text-sm">
                      설정: {formatTime(currentTime)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
