"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type StoryStep = {
  id: number;
  title: string;
  story: string;
  problem?: {
    question: string;
    a: number;
    b: number;
    op: "+" | "-";
    answer: number;
    options: number[];
  };
  emoji: string;
};

const storySteps: StoryStep[] = [
  {
    id: 1,
    title: "씨앗을 심어요",
    story:
      "보미가 정원에 씨앗을 심었어요. 첫 번째 구멍에 씨앗 2개를 넣었고, 두 번째 구멍에 씨앗 3개를 넣었어요.",
    emoji: "🌱",
  },
  {
    id: 2,
    title: "씨앗 세기",
    story:
      "보미가 심은 씨앗을 세어보려고 해요. 첫 번째 구멍의 씨앗과 두 번째 구멍의 씨앗을 모두 합하면 몇 개일까요?",
    problem: {
      question:
        "첫 번째 구멍에 씨앗 2개, 두 번째 구멍에 씨앗 3개를 심었어요. 총 몇 개의 씨앗을 심었을까요?",
      a: 2,
      b: 3,
      op: "+",
      answer: 5,
      options: [4, 5, 6, 7],
    },
    emoji: "🌱",
  },
  {
    id: 3,
    title: "물을 주어요",
    story:
      "보미가 씨앗들에게 물을 주었어요. 물뿌리개에 물이 8컵 들어있었는데, 씨앗들에게 3컵을 주었어요.",
    emoji: "💧",
  },
  {
    id: 4,
    title: "남은 물",
    story: "물뿌리개에 남은 물은 몇 컵일까요?",
    problem: {
      question:
        "물뿌리개에 물이 8컵 들어있었는데, 3컵을 사용했어요. 남은 물은 몇 컵일까요?",
      a: 8,
      b: 3,
      op: "-",
      answer: 5,
      options: [4, 5, 6, 7],
    },
    emoji: "💧",
  },
  {
    id: 5,
    title: "꽃이 피었어요",
    story:
      "며칠 후, 보미가 심은 씨앗에서 예쁜 꽃이 피었어요! 보미는 정말 기뻤어요. 🌸",
    emoji: "🌸",
  },
];

export default function SeedStoryPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showProblem, setShowProblem] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentStory = storySteps[currentStep];

  const handleAnswerSelect = useCallback(
    (answer: number) => {
      if (!currentStory.problem) return;

      setSelectedAnswer(answer);
      const correct = answer === currentStory.problem.answer;
      setIsCorrect(correct);
      setShowFeedback(true);

      // 2초 후 다음 스텝으로 이동
      setTimeout(() => {
        if (currentStep < storySteps.length - 1) {
          setCurrentStep((prev) => prev + 1);
          setShowProblem(false);
          setSelectedAnswer(null);
          setShowFeedback(false);
        }
      }, 2000);
    },
    [currentStep, currentStory.problem]
  );

  const handleNextStep = useCallback(() => {
    if (currentStep < storySteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const handleShowProblem = useCallback(() => {
    setShowProblem(true);
  }, []);

  const say = useCallback((text: string) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ko-KR";
      utter.rate = 0.8; // 스토리라서 조금 느리게
      utter.pitch = 1.1;
      utter.volume = 0.8;
      synth.cancel();
      synth.speak(utter);
    } catch {
      // ignore speech errors
    }
  }, []);

  useEffect(() => {
    if (currentStory.story) {
      say(currentStory.story);
    }

    // 컴포넌트가 언마운트될 때 음성 중단
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
  }, [currentStory.story, say]);

  const isLastStep = currentStep === storySteps.length - 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-blue-50">
      <div className="w-full max-w-2xl">
        {/* 진행 표시 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>보미의 모험</span>
            <span>
              {currentStep + 1} / {storySteps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / storySteps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* 스토리 카드 */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
          <div className="text-center">
            {/* 이모지 */}
            <div className="text-8xl mb-6">{currentStory.emoji}</div>

            {/* 제목 */}
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {currentStory.title}
            </h2>

            {/* 스토리 텍스트 */}
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              {currentStory.story}
            </p>

            {/* 문제가 있는 경우 */}
            {currentStory.problem && !showProblem && (
              <button
                onClick={handleShowProblem}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
              >
                문제 풀어보기
              </button>
            )}

            {/* 문제 표시 */}
            {currentStory.problem && showProblem && (
              <div className="mt-8">
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    {currentStory.problem.question}
                  </h3>
                  <div className="text-3xl font-bold text-blue-900 mb-6">
                    {currentStory.problem.a} {currentStory.problem.op}{" "}
                    {currentStory.problem.b} = ?
                  </div>

                  {/* 선택지 */}
                  <div className="grid grid-cols-2 gap-4">
                    {currentStory.problem.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={showFeedback}
                        className={`p-4 rounded-xl font-bold text-xl transition-all ${
                          showFeedback
                            ? option === currentStory.problem!.answer
                              ? "bg-green-500 text-white"
                              : selectedAnswer === option
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-500"
                            : "bg-white border-2 border-blue-300 hover:bg-blue-100 text-blue-800"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 피드백 */}
                {showFeedback && (
                  <div
                    className={`p-4 rounded-xl text-center ${
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {isCorrect ? "🎉 정답이에요!" : "😅 다시 생각해보세요"}
                    </div>
                    <p className="text-lg">
                      {isCorrect
                        ? "보미가 정말 기뻐해요!"
                        : `정답은 ${currentStory.problem!.answer}이에요!`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 다음 버튼 (문제가 없는 경우) */}
            {!currentStory.problem && !isLastStep && (
              <button
                onClick={handleNextStep}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
              >
                다음 이야기 →
              </button>
            )}

            {/* 완료 버튼 */}
            {isLastStep && (
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-4 text-green-600">
                  이야기 완료!
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  보미와 함께 멋진 모험을 했어요!
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/story"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    다른 이야기
                  </Link>
                  <Link
                    href="/"
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    메인으로
                  </Link>
                </div>
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
