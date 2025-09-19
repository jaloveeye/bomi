"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useLevelSystem } from "@/hooks/useLevelSystem";

// 다가오는 3D 벽 컴포넌트
function ApproachingWall({
  question,
  wallPosition,
  timeLeft,
  isAnswerCorrect,
  gameOverReason,
}: {
  question: string;
  wallPosition: number;
  timeLeft: number;
  isAnswerCorrect: boolean;
  gameOverReason: "timeout" | "wrong_answer" | null;
}) {
  // 벽 상태에 따른 색상 결정
  let wallColor = "#3b82f6"; // 기본 파란색
  let wallOpacity = 0.8;

  if (isAnswerCorrect) {
    // 정답일 때는 초록색으로 통과
    wallColor = "#10b981"; // 정답일 때 초록색
    wallOpacity = 0.3; // 투명하게
  } else if (gameOverReason === "wrong_answer") {
    // 오답일 때는 빨간색으로 멈춤
    wallColor = "#ef4444"; // 오답일 때 빨간색
    wallOpacity = 1.0; // 불투명하게
  } else if (gameOverReason === "timeout") {
    // 시간 초과일 때는 빨간색으로 멈춤
    wallColor = "#ef4444"; // 시간 초과 빨간색
    wallOpacity = 1.0; // 불투명하게
  }

  return (
    <group position={[0, 0, wallPosition]}>
      {/* 벽 배경 - 두께 추가 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 6, 0.5]} />
        <meshStandardMaterial
          color={wallColor}
          transparent
          opacity={wallOpacity}
        />
      </mesh>

      {/* 문제 텍스트 - 더 크게 */}
      <Text
        position={[0, 1.5, 0.26]}
        fontSize={1.0}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {question}
      </Text>

      {/* 시간 표시 - 더 크게 */}
      <Text
        position={[0, 2.5, 0.26]}
        fontSize={0.6}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
      >
        {timeLeft.toFixed(1)}초
      </Text>

      {/* 정답 보기는 숨김 - 게임 조건 단순화 */}
    </group>
  );
}

// 숫자 외계인 모델 컴포넌트 - 숫자 모양 자체를 3D로 표현
function AlienModel({
  headShape,
  bodyShape,
  armShape,
  legShape,
  onPartClick,
}: {
  headShape: string;
  bodyShape: string;
  armShape: string;
  legShape: string;
  onPartClick: (part: string) => void;
}) {
  return (
    <group>
      {/* 숫자 0 */}
      {headShape === "round" &&
        bodyShape === "circle" &&
        legShape === "circle" && (
          <group>
            {/* 0의 둥근 모양 */}
            <mesh position={[0, 0, 0]} onClick={() => onPartClick("head")}>
              <torusGeometry args={[1.5, 0.3, 16, 32]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
          </group>
        )}

      {/* 숫자 1 */}
      {headShape === "tall" && bodyShape === "tall" && legShape === "tall" && (
        <group>
          {/* 1의 직선 모양 */}
          <mesh position={[0, 0, 0]} onClick={() => onPartClick("head")}>
            <boxGeometry args={[0.3, 4, 0.3]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        </group>
      )}

      {/* 숫자 2 */}
      {headShape === "round" &&
        bodyShape === "wide" &&
        armShape === "long" &&
        legShape === "wide" && (
          <group>
            {/* 2의 곡선 모양 */}
            <mesh position={[0, 1.5, 0]} onClick={() => onPartClick("head")}>
              <boxGeometry args={[2, 0.3, 0.3]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
            <mesh position={[0, 0, 0]} onClick={() => onPartClick("body")}>
              <boxGeometry args={[2, 0.3, 0.3]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
            <mesh position={[0, -1.5, 0]} onClick={() => onPartClick("leg")}>
              <boxGeometry args={[2, 0.3, 0.3]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>
          </group>
        )}

      {/* 숫자 3 */}
      {headShape === "round" && bodyShape === "tall" && legShape === "tall" && (
        <group>
          {/* 3의 세로선 모양 */}
          <mesh position={[0, 0, 0]} onClick={() => onPartClick("head")}>
            <boxGeometry args={[0.3, 4, 0.3]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        </group>
      )}

      {/* 숫자 4 */}
      {headShape === "tall" &&
        bodyShape === "wide" &&
        armShape === "long" &&
        legShape === "tall" && (
          <group>
            {/* 4의 모양 */}
            <mesh position={[0, 1.5, 0]} onClick={() => onPartClick("head")}>
              <boxGeometry args={[0.3, 1, 0.3]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
            <mesh position={[0, 0, 0]} onClick={() => onPartClick("body")}>
              <boxGeometry args={[2, 0.3, 0.3]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
            <mesh position={[0, -1.5, 0]} onClick={() => onPartClick("leg")}>
              <boxGeometry args={[0.3, 1, 0.3]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>
          </group>
        )}

      {/* 숫자 5 */}
      {headShape === "round" && bodyShape === "wide" && legShape === "wide" && (
        <group>
          {/* 5의 모양 */}
          <mesh position={[0, 1.5, 0]} onClick={() => onPartClick("head")}>
            <boxGeometry args={[2, 0.3, 0.3]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
          <mesh position={[0, 0, 0]} onClick={() => onPartClick("body")}>
            <boxGeometry args={[2, 0.3, 0.3]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0, -1.5, 0]} onClick={() => onPartClick("leg")}>
            <boxGeometry args={[2, 0.3, 0.3]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>
      )}

      {/* 숫자 6 */}
      {headShape === "round" &&
        bodyShape === "circle" &&
        legShape === "circle" && (
          <group>
            {/* 6의 둥근 모양 */}
            <mesh position={[0, 0, 0]} onClick={() => onPartClick("head")}>
              <torusGeometry args={[1.5, 0.3, 16, 32]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
          </group>
        )}

      {/* 숫자 7 */}
      {headShape === "tall" && bodyShape === "tall" && legShape === "tall" && (
        <group>
          {/* 7의 세로선 모양 */}
          <mesh position={[0, 0, 0]} onClick={() => onPartClick("head")}>
            <boxGeometry args={[0.3, 4, 0.3]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        </group>
      )}

      {/* 숫자 8 */}
      {headShape === "round" &&
        bodyShape === "circle" &&
        legShape === "circle" && (
          <group>
            {/* 8의 두 원 모양 */}
            <mesh position={[0, 0.8, 0]} onClick={() => onPartClick("head")}>
              <torusGeometry args={[1, 0.3, 16, 32]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
            <mesh position={[0, -0.8, 0]} onClick={() => onPartClick("leg")}>
              <torusGeometry args={[1, 0.3, 16, 32]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>
          </group>
        )}

      {/* 숫자 9 */}
      {headShape === "round" &&
        bodyShape === "circle" &&
        legShape === "tall" && (
          <group>
            {/* 9의 모양 */}
            <mesh position={[0, 0, 0]} onClick={() => onPartClick("head")}>
              <torusGeometry args={[1.5, 0.3, 16, 32]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
            <mesh position={[0, -1.5, 0]} onClick={() => onPartClick("leg")}>
              <boxGeometry args={[0.3, 1, 0.3]} />
              <meshStandardMaterial color="#15803d" />
            </mesh>
          </group>
        )}

      {/* 기본 모양 (아무것도 선택되지 않았을 때) */}
      {!(
        headShape === "round" &&
        bodyShape === "circle" &&
        legShape === "circle"
      ) &&
        !(
          headShape === "tall" &&
          bodyShape === "tall" &&
          legShape === "tall"
        ) &&
        !(
          headShape === "round" &&
          bodyShape === "wide" &&
          armShape === "long" &&
          legShape === "wide"
        ) &&
        !(
          headShape === "round" &&
          bodyShape === "tall" &&
          legShape === "tall"
        ) &&
        !(
          headShape === "tall" &&
          bodyShape === "wide" &&
          armShape === "long" &&
          legShape === "tall"
        ) &&
        !(
          headShape === "round" &&
          bodyShape === "wide" &&
          legShape === "wide"
        ) &&
        !(
          headShape === "tall" &&
          bodyShape === "tall" &&
          legShape === "tall"
        ) &&
        !(
          headShape === "round" &&
          bodyShape === "circle" &&
          legShape === "circle"
        ) &&
        !(
          headShape === "round" &&
          bodyShape === "circle" &&
          legShape === "tall"
        ) && (
          <group>
            {/* 기본 외계인 모양 */}
            <mesh position={[0, 0, 0]} onClick={() => onPartClick("head")}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
          </group>
        )}
    </group>
  );
}

// 숫자 프리셋 정의 - 각 숫자의 특징적인 모양
const numberPresets: Record<
  number,
  { headShape: string; bodyShape: string; armShape: string; legShape: string }
> = {
  0: {
    headShape: "round", // 둥근 머리
    bodyShape: "circle", // 원형 몸통 (0의 둥근 모양)
    armShape: "short", // 짧은 팔
    legShape: "circle", // 원형 다리
  },
  1: {
    headShape: "tall", // 세로 긴 머리
    bodyShape: "tall", // 세로 긴 몸통 (1의 직선 모양)
    armShape: "short", // 짧은 팔
    legShape: "tall", // 세로 긴 다리
  },
  2: {
    headShape: "round", // 둥근 머리
    bodyShape: "wide", // 넓은 몸통 (2의 곡선)
    armShape: "long", // 긴 팔 (2의 상단 곡선)
    legShape: "wide", // 넓은 다리 (2의 하단 곡선)
  },
  3: {
    headShape: "round", // 둥근 머리
    bodyShape: "tall", // 세로 긴 몸통 (3의 세로선)
    armShape: "short", // 짧은 팔
    legShape: "tall", // 세로 긴 다리
  },
  4: {
    headShape: "tall", // 세로 긴 머리
    bodyShape: "wide", // 넓은 몸통 (4의 가로선)
    armShape: "long", // 긴 팔 (4의 대각선)
    legShape: "tall", // 세로 긴 다리
  },
  5: {
    headShape: "round", // 둥근 머리
    bodyShape: "wide", // 넓은 몸통 (5의 상단 가로선)
    armShape: "short", // 짧은 팔
    legShape: "wide", // 넓은 다리 (5의 하단 가로선)
  },
  6: {
    headShape: "round", // 둥근 머리
    bodyShape: "circle", // 원형 몸통 (6의 둥근 모양)
    armShape: "short", // 짧은 팔
    legShape: "circle", // 원형 다리
  },
  7: {
    headShape: "tall", // 세로 긴 머리
    bodyShape: "tall", // 세로 긴 몸통 (7의 세로선)
    armShape: "short", // 짧은 팔
    legShape: "tall", // 세로 긴 다리
  },
  8: {
    headShape: "round", // 둥근 머리
    bodyShape: "circle", // 원형 몸통 (8의 두 원)
    armShape: "short", // 짧은 팔
    legShape: "circle", // 원형 다리
  },
  9: {
    headShape: "round", // 둥근 머리
    bodyShape: "circle", // 원형 몸통 (9의 둥근 모양)
    armShape: "short", // 짧은 팔
    legShape: "tall", // 세로 긴 다리 (9의 하단 직선)
  },
};

// 수학 문제 생성
function generateMathProblem() {
  const operations = ["+", "-"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let num1, num2, answer;

  if (operation === "+") {
    // 덧셈: 정답이 0-9 범위에 맞도록 조정
    num1 = Math.floor(Math.random() * 5) + 1; // 1-5
    num2 = Math.floor(Math.random() * (9 - num1)) + 1; // 1 to (9-num1)
    answer = num1 + num2; // 최대 9가 됨
  } else {
    // 뺄셈: 정답이 0-9 범위에 맞도록 조정
    num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    num2 = Math.floor(Math.random() * num1) + 1; // 1 to num1
    answer = num1 - num2; // 0-8 범위
  }

  // 정답과 함께 3개의 오답 생성
  const wrongAnswers: number[] = [];
  while (wrongAnswers.length < 3) {
    const wrong = Math.floor(Math.random() * 10);
    if (wrong !== answer && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }

  const allAnswers = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);

  return {
    question: `${num1} ${operation} ${num2} = ?`,
    answer,
    choices: allAnswers,
  };
}

export default function AlienPlayPage() {
  const [currentProblem, setCurrentProblem] = useState(generateMathProblem());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [alienShape, setAlienShape] = useState(numberPresets[0]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // 시간 제한 및 벽 시스템
  const [timeLeft, setTimeLeft] = useState(10); // 10초 제한
  const [wallPosition, setWallPosition] = useState(-15); // 벽 시작 위치 (정면에서 시작)
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<
    "timeout" | "wrong_answer" | null
  >(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); // 정답 여부 추적

  // 최신 상태를 참조하기 위한 ref
  const alienShapeRef = useRef(alienShape);
  const currentProblemRef = useRef(currentProblem);
  const totalQuestionsRef = useRef(totalQuestions);
  const scoreRef = useRef(score);
  const isAnswerCorrectRef = useRef(isAnswerCorrect);

  // ref 업데이트
  useEffect(() => {
    alienShapeRef.current = alienShape;
  }, [alienShape]);

  useEffect(() => {
    currentProblemRef.current = currentProblem;
  }, [currentProblem]);

  useEffect(() => {
    totalQuestionsRef.current = totalQuestions;
  }, [totalQuestions]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    isAnswerCorrectRef.current = isAnswerCorrect;
  }, [isAnswerCorrect]);

  const { handleCorrectAnswer, handleIncorrectAnswer, checkPerfectScore } =
    useLevelSystem();

  // 시간 제한 및 벽 움직임 관리
  useEffect(() => {
    if (!gameStarted || gameOver || gameFinished || showFeedback) return;

    const interval = setInterval(() => {
      setWallPosition((prev) => {
        const newPosition = prev + 0.15; // 벽이 Z축으로 0.15씩 다가옴 (10초 만에 도달)
        // 벽이 외계인 위치(Z=0)에 도달하면 충돌 체크 (한 번만)
        if (newPosition >= 0 && prev < 0) {
          console.log("충돌 체크 시작!", { newPosition, prev });
          const currentAlienShape = alienShapeRef.current;
          const defaultShape = numberPresets[0];

          // 외계인이 기본 모양(0번)인지 확인
          const isDefaultShape =
            currentAlienShape.headShape === defaultShape.headShape &&
            currentAlienShape.bodyShape === defaultShape.bodyShape &&
            currentAlienShape.armShape === defaultShape.armShape &&
            currentAlienShape.legShape === defaultShape.legShape;

          console.log("외계인 모양 체크:", {
            currentAlienShape,
            defaultShape,
            isDefaultShape,
          });

          // 기본 모양이면 정답 체크하지 않고 시간 초과만 체크
          if (isDefaultShape) {
            console.log("기본 모양 - 시간 초과!");
            setGameOverReason("timeout");
            setGameOver(true);
            return 0; // 벽이 멈춘 위치 (시간 초과로 처리됨)
          }

          // 선택된 모양이면 정답 여부 확인
          const correctShape = numberPresets[currentProblemRef.current.answer];
          const isShapeCorrect =
            currentAlienShape.headShape === correctShape.headShape &&
            currentAlienShape.bodyShape === correctShape.bodyShape &&
            currentAlienShape.armShape === correctShape.armShape &&
            currentAlienShape.legShape === correctShape.legShape;

          console.log("정답 체크:", {
            currentAlienShape,
            correctShape,
            isShapeCorrect,
            answer: currentProblemRef.current.answer,
          });

          if (isShapeCorrect) {
            // 정답이면 벽이 통과하고 다음 문제로
            setIsAnswerCorrect(true); // 정답 상태 설정
            handleCorrectAnswer("alien_transform", "easy");

            // 점수와 문제 수를 즉시 업데이트
            const newTotalQuestions = totalQuestionsRef.current + 1;
            const newScore = scoreRef.current + 1;

            setTotalQuestions(newTotalQuestions);
            setScore(newScore);

            // 다음 문제로 이동
            setTimeout(() => {
              console.log(`정답 맞춤! 현재 문제 수: ${newTotalQuestions}`);
              if (newTotalQuestions >= 10) {
                console.log("게임 완료!");
                setGameFinished(true);
                checkPerfectScore(newScore, 10);
              } else {
                console.log("다음 문제로 진행");
                setCurrentProblem(generateMathProblem());
                setAlienShape(numberPresets[0]);
                setTimeLeft(10);
                setWallPosition(-15);
                setIsAnswerCorrect(false); // 정답 상태 리셋
              }
            }, 2000); // 2초로 연장하여 벽이 통과하는 것을 볼 수 있게

            return newPosition; // 벽이 계속 통과하도록
          } else {
            // 오답이면 게임 오버
            setGameOverReason("wrong_answer");
            setGameOver(true);
            return 0; // 벽이 멈춘 위치
          }
        }
        return newPosition;
      });

      // 정답이 아닐 때만 시간 체크 (정답이면 시간이 멈춤)
      if (!isAnswerCorrectRef.current) {
        setTimeLeft((prev) => {
          const newTime = prev - 0.1;
          if (newTime <= 0) {
            setGameOverReason("timeout");
            setGameOver(true);
            return 0;
          }
          return newTime;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    gameStarted,
    gameOver,
    gameFinished,
    showFeedback,
    handleCorrectAnswer,
    checkPerfectScore,
  ]);

  // 외계인 부위 클릭 핸들러 - 다양한 모양 옵션 지원
  const handlePartClick = (part: string) => {
    setAlienShape((prev) => {
      const newShape = { ...prev };
      switch (part) {
        case "head":
          // round -> tall -> flat -> round 순환
          if (newShape.headShape === "round") newShape.headShape = "tall";
          else if (newShape.headShape === "tall") newShape.headShape = "flat";
          else if (newShape.headShape === "flat") newShape.headShape = "round";
          else newShape.headShape = "round";
          break;
        case "body":
          // wide -> tall -> circle -> wide 순환
          if (newShape.bodyShape === "wide") newShape.bodyShape = "tall";
          else if (newShape.bodyShape === "tall") newShape.bodyShape = "circle";
          else if (newShape.bodyShape === "circle") newShape.bodyShape = "wide";
          else newShape.bodyShape = "wide";
          break;
        case "arm":
          // short -> long -> wide -> short 순환
          if (newShape.armShape === "short") newShape.armShape = "long";
          else if (newShape.armShape === "long") newShape.armShape = "wide";
          else if (newShape.armShape === "wide") newShape.armShape = "short";
          else newShape.armShape = "short";
          break;
        case "leg":
          // wide -> tall -> circle -> wide 순환
          if (newShape.legShape === "wide") newShape.legShape = "tall";
          else if (newShape.legShape === "tall") newShape.legShape = "circle";
          else if (newShape.legShape === "circle") newShape.legShape = "wide";
          else newShape.legShape = "wide";
          break;
      }
      return newShape;
    });
  };

  // 프리셋 적용
  const applyPreset = (number: number) => {
    setAlienShape(numberPresets[number]);
  };

  // 정답 확인 함수는 더 이상 필요하지 않음 (충돌 시 자동으로 체크됨)

  // 게임 재시작
  const restartGame = () => {
    setCurrentProblem(generateMathProblem());
    setSelectedAnswer(null);
    setAlienShape(numberPresets[0]);
    setScore(0);
    setTotalQuestions(0);
    setShowFeedback(false);
    setGameFinished(false);
    setGameOver(false);
    setGameOverReason(null);
    setIsAnswerCorrect(false);
    setGameStarted(false);
    setTimeLeft(10);
    setWallPosition(-15);
  };

  // 게임 시작
  const startGame = () => {
    setGameStarted(true);
  };

  if (gameFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 게임 완료!
          </h2>
          <div className="text-2xl mb-6">
            <span className="text-green-600 font-bold">{score}</span> /{" "}
            {totalQuestions}
          </div>
          <div className="text-lg text-gray-600 mb-6">
            {score === totalQuestions ? "완벽해요! 👽✨" : "잘했어요! 👽"}
          </div>
          <button
            onClick={restartGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            다시 하기
          </button>
          <Link
            href="/alien"
            className="block mt-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← 게임 선택으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <Link
          href="/alien"
          className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">뒤로</span>
        </Link>
        <div className="text-lg font-bold text-gray-800">
          점수: {score} / {totalQuestions}
        </div>
        <button
          onClick={restartGame}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* 3D 화면 - 세로를 줄임 */}
        <div className="h-[60vh] bg-gray-100">
          <Canvas camera={{ position: [6, 3, 8], fov: 75 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} />
            <pointLight position={[-10, -10, -10]} />

            {/* 다가오는 3D 벽 */}
            <ApproachingWall
              question={currentProblem.question}
              wallPosition={wallPosition}
              timeLeft={timeLeft}
              isAnswerCorrect={isAnswerCorrect}
              gameOverReason={gameOverReason}
            />

            {/* 외계인 모델 */}
            <AlienModel
              headShape={alienShape.headShape}
              bodyShape={alienShape.bodyShape}
              armShape={alienShape.armShape}
              legShape={alienShape.legShape}
              onPartClick={handlePartClick}
            />

            <OrbitControls enablePan={false} />
          </Canvas>
        </div>

        {/* 컨트롤 패널 - 세로 공간 확보 */}
        <div className="flex-1 bg-white p-6 overflow-y-auto">
          {/* 게임 상태 표시 */}
          {!gameStarted && !gameOver && (
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🚀 게임 시작 준비!
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                정면에서 다가오는 벽이 숫자 외계인에게 닿기 전에
                <br />
                숫자 외계인을 정답 숫자 모양으로 만들어보세요!
              </p>
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300"
              >
                🎮 게임 시작!
              </button>
            </div>
          )}

          {gameOver && (
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                💥 게임 오버!
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {gameOverReason === "timeout"
                  ? "⏰ 시간이 다 되었어요! 더 빠르게 문제를 풀어보세요!"
                  : gameOverReason === "wrong_answer"
                  ? "❌ 정답이 아니에요! 벽이 숫자 외계인에게 닿았어요!"
                  : "🚧 게임이 끝났어요!"}
              </p>
              <button
                onClick={restartGame}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300"
              >
                🔄 다시 도전!
              </button>
            </div>
          )}

          {gameStarted && !gameOver && (
            <>
              {/* 게임 안내 */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  🔢 벽이 닿기 전에 정답 숫자 모양으로 변신하세요!
                </h2>
                <div className="text-sm text-gray-600 text-center mb-4">
                  정답이면 벽이 통과하고, 오답이면 벽에 부딪혀 게임 오버!
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {timeLeft.toFixed(1)}초
                  </div>
                  <div className="text-xs text-gray-500">남은 시간</div>
                </div>
              </div>
            </>
          )}

          {gameStarted && !gameOver && (
            <>
              {/* 프리셋 버튼 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  🎯 숫자 프리셋
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => applyPreset(num)}
                      className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg font-bold text-lg hover:from-purple-200 hover:to-pink-200 transition-all duration-300"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* 터치 조정 안내 */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  ✋ 숫자 외계인 조정
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    • <strong>프리셋 버튼:</strong> 0~9 숫자 모양으로 즉시 변신
                  </div>
                  <div>
                    • <strong>터치 조정:</strong> 각 부위를 터치해서 세부 모양
                    변경
                  </div>
                  <div>
                    • <strong>자동 체크:</strong> 벽이 닿으면 자동으로 정답
                    확인!
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    💡 3D 화면에서 숫자 외계인을 회전시켜 다양한 각도에서 볼 수
                    있어요
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 피드백은 더 이상 필요하지 않음 (충돌 시 자동으로 처리됨) */}
        </div>
      </div>
    </div>
  );
}
