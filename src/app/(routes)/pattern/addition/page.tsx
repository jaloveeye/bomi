"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type AdditionPattern = {
  id: number;
  sequence: number[];
  answer: number;
  description: string;
  emoji: string;
};

const additionPatterns: AdditionPattern[] = [
  {
    id: 1,
    sequence: [2, 4, 6, 8],
    answer: 10,
    description: "2씩 더하기",
    emoji: "➕",
  },
  {
    id: 2,
    sequence: [1, 3, 5, 7],
    answer: 9,
    description: "2씩 더하기",
    emoji: "➕",
  },
  {
    id: 3,
    sequence: [5, 10, 15, 20],
    answer: 25,
    description: "5씩 더하기",
    emoji: "➕",
  },
  {
    id: 4,
    sequence: [3, 6, 9, 12],
    answer: 15,
    description: "3씩 더하기",
    emoji: "➕",
  },
  {
    id: 5,
    sequence: [4, 8, 12, 16],
    answer: 20,
    description: "4씩 더하기",
    emoji: "➕",
  },
];

export default function AdditionPatternPage() {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const pattern = additionPatterns[currentPattern];
  const options = [
    pattern.answer,
    pattern.answer + 2,
    pattern.answer - 2,
    pattern.answer + 1,
  ].sort(() => Math.random() - 0.5);

  const say = useCallback((text: string) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) {
        console.log("음성 합성을 지원하지 않는 브라우저입니다.");
        return;
      }
      
      // 기존 음성 중단
      synth.cancel();
      
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ko-KR";
      utter.rate = 0.8;
      utter.pitch = 1.1;
      utter.volume = 0.8;
      
      // 음성 이벤트 리스너 추가
      utter.onstart = () => console.log("음성 재생 시작:", text);
      utter.onerror = (event) => console.log("음성 재생 오류:", event.error);
      utter.onend = () => console.log("음성 재생 완료");
      
      synth.speak(utter);
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
          say("정답이에요! 덧셈 패턴을 잘 찾았어요!");
        }, 100);
      } else {
        // 오답 음성 메시지 - 사용자 클릭 후이므로 즉시 재생 가능
        setTimeout(() => {
          say(`틀렸어요. 정답은 ${pattern.answer}이에요.`);
        }, 100);
      }

      // 2초 후 다음 패턴으로 이동
      setTimeout(() => {
        if (currentPattern < additionPatterns.length - 1) {
          setCurrentPattern((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
        } else {
          setGameFinished(true);
        }
      }, 2000);
    },
    [currentPattern, pattern.answer, say]
  );

  useEffect(() => {
    const description = `${
      pattern.description
    } 패턴이에요. ${pattern.sequence.join(", ")} 다음에 올 숫자는 무엇일까요?`;
    say(description);
  }, [pattern, say]);

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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-blue-50">
        <div className="w-full max-w-2xl text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold mb-4 text-green-600">
              덧셈 패턴 완료!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              총 {additionPatterns.length}개 문제 중 {score}개를 맞췄어요!
            </p>
            <div className="text-2xl font-bold text-blue-600 mb-8">
              점수: {score} / {additionPatterns.length}
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-blue-50">
      <div className="w-full max-w-2xl">
        {/* 진행 표시 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>덧셈 패턴</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => say("음성 테스트입니다. 들리시나요?")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                🔊 음성 테스트
              </button>
              <span>
                {currentPattern + 1} / {additionPatterns.length}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((currentPattern + 1) / additionPatterns.length) * 100
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
              <div className="text-4xl font-bold text-blue-900 mb-4">
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
                      : "bg-blue-100 border-2 border-blue-300 hover:bg-blue-200 text-blue-800"
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
                    ? "패턴을 잘 찾았어요!"
                    : `정답은 ${pattern.answer}이에요!`}
                </p>
                {!isCorrect && (
                  <p className="text-lg mt-2">
                    {pattern.description}이므로{" "}
                    {pattern.sequence[pattern.sequence.length - 1]} +{" "}
                    {pattern.sequence[1] - pattern.sequence[0]} ={" "}
                    {pattern.answer}
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
