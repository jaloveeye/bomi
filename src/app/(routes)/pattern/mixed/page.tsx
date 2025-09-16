"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type MixedPattern = {
  id: number;
  sequence: number[];
  answer: number;
  description: string;
  emoji: string;
};

const mixedPatterns: MixedPattern[] = [
  {
    id: 1,
    sequence: [10, 8, 12, 10],
    answer: 14,
    description: "2씩 빼고 4씩 더하기",
    emoji: "🔄",
  },
  {
    id: 2,
    sequence: [5, 10, 8, 13],
    answer: 11,
    description: "5씩 더하고 2씩 빼기",
    emoji: "🔄",
  },
  {
    id: 3,
    sequence: [20, 15, 18, 13],
    answer: 16,
    description: "5씩 빼고 3씩 더하기",
    emoji: "🔄",
  },
  {
    id: 4,
    sequence: [3, 6, 4, 7],
    answer: 5,
    description: "3씩 더하고 2씩 빼기",
    emoji: "🔄",
  },
  {
    id: 5,
    sequence: [12, 8, 11, 7],
    answer: 10,
    description: "4씩 빼고 3씩 더하기",
    emoji: "🔄",
  },
];

export default function MixedPatternPage() {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [options, setOptions] = useState<number[]>([]);

  const pattern = mixedPatterns[currentPattern];

  // 패턴이 변경될 때마다 options 생성
  useEffect(() => {
    const newOptions = [
      pattern.answer,
      pattern.answer + 2,
      pattern.answer - 2,
      pattern.answer + 1,
    ].sort(() => Math.random() - 0.5);
    setOptions(newOptions);
  }, [currentPattern, pattern.answer]);

  const say = useCallback((text: string) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) {
        console.log("음성 합성을 지원하지 않는 브라우저입니다.");
        return;
      }

      // 기존 음성 중단
      synth.cancel();

      // 음성 합성 초기화를 위한 짧은 대기
      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "ko-KR";
        utter.rate = 0.8;
        utter.pitch = 1.1;
        utter.volume = 0.8;

        // 음성 이벤트 리스너 추가
        utter.onstart = () => console.log("음성 재생 시작:", text);
        utter.onerror = (event) => console.log("음성 재생 오류:", event.error);
        utter.onend = () => console.log("음성 재생 완료");

        // 음성 합성 상태 확인
        if (synth.speaking) {
          console.log("이미 음성이 재생 중입니다.");
          return;
        }

        synth.speak(utter);
      }, 100);
    } catch (error) {
      console.log("음성 재생 중 오류 발생:", error);
    }
  }, []);

  const handleAnswerSelect = useCallback(
    (answer: number) => {
      setSelectedAnswer(answer);
      const correct = answer === pattern.answer;
      setIsCorrect(correct);
      setShowFeedback(true);

      if (correct) {
        setScore((prev) => prev + 1);
        // 정답 음성 메시지 - 사용자 클릭 후이므로 즉시 재생 가능
        setTimeout(() => {
          say("정답이에요! 복잡한 패턴을 잘 찾았어요!");
        }, 100);
      } else {
        // 오답 음성 메시지 - 사용자 클릭 후이므로 즉시 재생 가능
        setTimeout(() => {
          say(`틀렸어요. 정답은 ${pattern.answer}이에요.`);
        }, 100);
      }

      // 1초 후 다음 패턴으로 이동
      setTimeout(() => {
        if (currentPattern < mixedPatterns.length - 1) {
          setCurrentPattern((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
        } else {
          setGameFinished(true);
        }
      }, 1000);
    },
    [currentPattern, pattern.answer, say]
  );

  // 자동 음성 재생 제거 - 브라우저 정책상 사용자 상호작용 후에만 음성 재생 가능

  // 컴포넌트 언마운트 시 음성 중단
  useEffect(() => {
    return () => {
      try {
        const synth = window.speechSynthesis;
        if (synth) {
          synth.cancel();
        }
      } catch {
        // ignore speech errors
      }
    };
  }, []);

  if (gameFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="w-full max-w-2xl text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold mb-4 text-purple-600">
              섞인 패턴 완료!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              총 {mixedPatterns.length}개 문제 중 {score}개를 맞췄어요!
            </p>
            <div className="text-2xl font-bold text-blue-600 mb-8">
              점수: {score} / {mixedPatterns.length}
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/pattern"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                다른 패턴
              </Link>
              <Link
                href="/"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                메인으로
              </Link>
            </div>
          </div>

          {/* 보미 캐릭터 */}
          <div className="flex justify-center">
            <div className="animate-float">
              <Image
                src="/bomi-character.png"
                alt="보미 캐릭터"
                width={120}
                height={150}
                className="w-28 h-36 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="w-full max-w-2xl">
        {/* 진행 표시 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>섞인 패턴</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const description = `${
                    pattern.description
                  } 패턴이에요. ${pattern.sequence.join(
                    ", "
                  )} 다음에 올 숫자는 무엇일까요?`;
                  alert(description);
                }}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                📢 패턴 설명
              </button>
              <span>
                {currentPattern + 1} / {mixedPatterns.length}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentPattern + 1) / mixedPatterns.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* 패턴 카드 */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
          <div className="text-center">
            {/* 이모지 */}
            <div className="text-8xl mb-6">{pattern.emoji}</div>

            {/* 패턴 설명 */}
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {pattern.description} 패턴
            </h2>

            {/* 숫자 시퀀스 */}
            <div className="mb-8">
              <div className="text-4xl font-bold text-purple-900 mb-4">
                {pattern.sequence.map((num, index) => (
                  <span key={index} className="mx-2">
                    {num}
                    {index < pattern.sequence.length - 1 && (
                      <span className="text-gray-400">,</span>
                    )}
                  </span>
                ))}
                <span className="text-red-500 mx-2">?</span>
              </div>
              <p className="text-lg text-gray-600">
                다음에 올 숫자는 무엇일까요?
              </p>
            </div>

            {/* 선택지 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`p-6 rounded-xl font-bold text-2xl transition-all ${
                    showFeedback
                      ? option === pattern.answer
                        ? "bg-green-500 text-white"
                        : selectedAnswer === option
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-500"
                      : "bg-purple-100 border-2 border-purple-300 hover:bg-purple-200 text-purple-800"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* 피드백 */}
            {showFeedback && (
              <div
                className={`p-6 rounded-xl text-center ${
                  isCorrect
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <div className="text-3xl mb-3">
                  {isCorrect ? "🎉 정답이에요!" : "😅 다시 생각해보세요"}
                </div>
                <p className="text-xl">
                  {isCorrect
                    ? "복잡한 패턴을 잘 찾았어요!"
                    : `정답은 ${pattern.answer}이에요!`}
                </p>
                {!isCorrect && (
                  <p className="text-lg mt-2">
                    {pattern.description} 패턴을 다시 살펴보세요!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 보미 캐릭터 */}
        <div className="flex justify-center">
          <div className="animate-float">
            <Image
              src="/bomi-character.png"
              alt="보미 캐릭터"
              width={120}
              height={150}
              className="w-28 h-36 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
