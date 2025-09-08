"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GAME_CONFIG } from "../constants/game";

type ScoreData = {
  id: number;
  name: string;
  score: number;
  gameType: string;
  date: string;
  timestamp: number;
};

type Problem = {
  a: number;
  b: number;
  op: "+" | "-" | "×";
  answer: number;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDigitRange(digits: number): [number, number] {
  if (digits <= 1) return [1, 9]; // 0 제외하고 1-9로 변경
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return [min, max];
}

function generateProblem(digits: number): Problem {
  const operator: "+" | "-" | "×" = Math.random() < 0.5 ? "+" : "-";

  const [min, max] = getDigitRange(digits);

  if (operator === "+") {
    const a = getRandomInt(min, max);
    const b = getRandomInt(min, max);
    return { a, b, op: "+", answer: a + b };
  }

  // subtraction: ensure positive result (no zero)
  let a = getRandomInt(min, max);
  let b = getRandomInt(min, max);
  if (b >= a) [a, b] = [b + 1, a]; // a > b가 되도록 보장하여 결과가 0이 되지 않도록 함
  return { a, b, op: "-", answer: a - b };
}

function generateMultiplicationProblem(table: number): Problem {
  const b = getRandomInt(1, 9);
  return { a: table, b, op: "×", answer: table * b };
}

function getDefaultProblem(digits: number): Problem {
  const base = digits === 1 ? 1 : Math.pow(10, digits - 1);
  const a = base;
  const b = base;
  const answer = a + b;
  return { a, b, op: "+", answer };
}

function digitsLabelKorean(digits: number): string {
  if (digits === 1) return "한자리수";
  if (digits === 2) return "두자리수";
  if (digits === 3) return "세자리수";
  if (digits === 4) return "네자리수";
  return `${digits}자리수`;
}

type PracticeGameProps = {
  digits?: number;
  multiplicationTable?: number;
};

export default function PracticeGame({
  digits,
  multiplicationTable,
}: PracticeGameProps) {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState<Problem>(() => {
    if (multiplicationTable) {
      return generateMultiplicationProblem(multiplicationTable);
    }
    return getDefaultProblem(digits || 1);
  });
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [playerName, setPlayerName] = useState("");

  // 디버깅을 위한 useEffect
  useEffect(() => {
    console.log("상태 변화:", { running, gameFinished, timeLeft });
  }, [running, gameFinished, timeLeft]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [options, setOptions] = useState<number[]>([]);

  const intervalRef = useRef<number | null>(null);

  const buildOptions = useCallback((p: Problem) => {
    const set = new Set<number>([p.answer]);
    while (set.size < 4) {
      const delta = getRandomInt(-3, 3) || 1;
      const candidate = p.answer + delta * getRandomInt(1, 2);
      if (candidate >= 0) set.add(candidate);
    }
    const arr = Array.from(set);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOptions(arr);
  }, []);

  useEffect(() => {
    // On first client mount or when digits/table change while not running,
    // create a new random problem only on the client to avoid hydration mismatch
    if (!running && !gameFinished) {
      const p = multiplicationTable
        ? generateMultiplicationProblem(multiplicationTable)
        : generateProblem(digits || 1);
      setProblem(p);
      setFeedback(null);
      setShowAnswer(false);
      buildOptions(p);
    }
  }, [digits, multiplicationTable, running, gameFinished, buildOptions]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  // timeLeft가 0이 되면 게임 종료
  useEffect(() => {
    if (running && timeLeft <= 0) {
      console.log("게임 종료! 시간이 다 되었습니다.");
      setRunning(false);
      setGameFinished(true);
    }
  }, [running, timeLeft]);

  // numeric input removed; keep code minimal

  const say = useCallback(
    (text: string) => {
      if (!voiceEnabled) return;
      try {
        const synth = window.speechSynthesis;
        if (!synth) return;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "ko-KR";
        utter.rate = 1.3; // 속도 증가 (기본값 1.0)
        utter.pitch = 1.1; // 피치 약간 높임 (기본값 1.0)
        utter.volume = 0.8; // 볼륨 조정 (기본값 1.0)
        synth.cancel();
        synth.speak(utter);
      } catch {
        // ignore speech errors
      }
    },
    [voiceEnabled]
  );

  const startGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setTimeLeft(GAME_CONFIG.TIMER_SECONDS);
    const p = multiplicationTable
      ? generateMultiplicationProblem(multiplicationTable)
      : generateProblem(digits || 1);
    setProblem(p);
    setFeedback(null);
    setShowAnswer(false);
    setGameFinished(false);
    buildOptions(p);
    setRunning(true);
  }, [digits, multiplicationTable, buildOptions]);

  // resetGame removed per new flow (no explicit reset button)

  const submitAnswer = useCallback(
    (selected: number) => {
      if (!running) return;

      if (selected === problem.answer) {
        const newStreak = streak + 1;
        setScore((s) => s + 1);
        setStreak(newStreak);
        setFeedback("correct");
        say("정답!");
        const next = multiplicationTable
          ? generateMultiplicationProblem(multiplicationTable)
          : generateProblem(digits || 1);
        setProblem(next);
        buildOptions(next);
      } else {
        setStreak(0);
        setFeedback("wrong");
        setShowAnswer(true);
        try {
          if ("vibrate" in navigator) {
            navigator.vibrate?.(60);
          }
        } catch {}
        say("틀렸어요");

        // 0.5초 후 다음 문제로 이동
        setTimeout(() => {
          const next = multiplicationTable
            ? generateMultiplicationProblem(multiplicationTable)
            : generateProblem(digits || 1);
          setProblem(next);
          buildOptions(next);
          setFeedback(null);
          setShowAnswer(false);
        }, 500);
      }
    },
    [
      digits,
      multiplicationTable,
      problem.answer,
      running,
      say,
      streak,
      buildOptions,
    ]
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
    }
  }, []);

  const saveScore = useCallback(() => {
    if (!playerName.trim()) return;

    const gameType = multiplicationTable
      ? `${multiplicationTable}단 구구단`
      : `${digitsLabelKorean(digits || 1)} 덧셈·뺄셈`;

    const scoreData = {
      id: Date.now(),
      name: playerName.trim(),
      score,
      gameType,
      date: new Date().toLocaleString("ko-KR"),
      timestamp: Date.now(),
    };

    const existingScores = JSON.parse(
      localStorage.getItem("mathGameScores") || "[]"
    );
    existingScores.push(scoreData);

    // 최고 점수 순으로 정렬하고 최대 100개 기록만 유지
    const sortedScores = existingScores
      .sort((a: ScoreData, b: ScoreData) => {
        // 먼저 점수로 정렬 (높은 점수 우선)
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // 점수가 같으면 최근 기록 우선
        return b.timestamp - a.timestamp;
      })
      .slice(0, 100);

    localStorage.setItem("mathGameScores", JSON.stringify(sortedScores));

    setShowScoreForm(false);
    setPlayerName("");
    alert("점수가 저장되었습니다! 🎉");
  }, [playerName, score, multiplicationTable, digits]);

  const title = useMemo(() => {
    if (multiplicationTable) {
      return `${multiplicationTable}단 구구단`;
    }
    const base = digitsLabelKorean(digits || 1);
    return `${base} 덧셈·뺄셈`;
  }, [digits, multiplicationTable]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-start p-4 gap-4 max-w-screen-sm mx-auto">
      <h1 className="text-3xl font-bold mt-2">{title}</h1>

      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm" aria-label="남은 시간">
              ⏱️ {timeLeft}s
            </span>
            <span className="text-sm" aria-label="점수">
              점수: {score}
            </span>
          </div>
        </div>

        {(() => {
          console.log("렌더링 조건 확인:", { gameFinished, running });
          return gameFinished;
        })() ? (
          <div className="flex flex-col items-center justify-center py-10 gap-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🎉 게임 종료! 🎉</h2>
              <div className="text-2xl mb-2">
                최종 점수:{" "}
                <span className="font-bold text-blue-600">{score}점</span>
              </div>
              <div className="text-lg text-gray-600">
                {score >= 20
                  ? "와! 정말 잘했어요! 🌟"
                  : score >= 15
                  ? "훌륭해요! 👏"
                  : score >= 10
                  ? "잘했어요! 😊"
                  : score >= 5
                  ? "좋아요! 더 연습해보세요! 💪"
                  : "다음엔 더 잘할 수 있어요! 화이팅! 🚀"}
              </div>
            </div>
            {!showScoreForm ? (
              <div className="flex flex-col gap-4">
                <button
                  className="h-14 px-6 rounded-full text-lg font-bold kid-button border border-black/10 bg-[#ffd700] active:scale-[.98]"
                  onClick={() => setShowScoreForm(true)}
                >
                  점수 기록하기
                </button>
                <div className="flex gap-4">
                  <button
                    className="h-14 px-6 rounded-full text-lg font-bold kid-button border border-black/10 bg-[#e7f7ea] active:scale-[.98]"
                    onClick={startGame}
                  >
                    다시 도전하기
                  </button>
                  <button
                    className="h-14 px-6 rounded-full text-lg font-bold kid-button border border-black/10 bg-[#f0f0f0] active:scale-[.98]"
                    onClick={() => (window.location.href = "/")}
                  >
                    처음으로
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full max-w-sm">
                <div className="text-center mb-2">
                  <h3 className="text-xl font-bold mb-2">점수 기록하기</h3>
                  <p className="text-sm text-gray-600">
                    {multiplicationTable
                      ? `${multiplicationTable}단 구구단`
                      : `${digitsLabelKorean(digits || 1)} 덧셈·뺄셈`}{" "}
                    - {score}점
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="h-12 px-4 rounded-full text-lg border border-black/20 bg-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={10}
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    className="flex-1 h-12 rounded-full text-base font-bold kid-button border border-black/10 bg-[#e7f7ea] active:scale-[.98]"
                    onClick={saveScore}
                    disabled={!playerName.trim()}
                  >
                    저장하기
                  </button>
                  <button
                    className="flex-1 h-12 rounded-full text-base font-bold kid-button border border-black/10 bg-[#f0f0f0] active:scale-[.98]"
                    onClick={() => {
                      setShowScoreForm(false);
                      setPlayerName("");
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : !running ? (
          <div className="flex flex-col items-center justify-center py-10 gap-6">
            <button
              className="h-16 px-10 rounded-full text-xl font-bold kid-button border border-black/10 bg-[#e7f7ea] active:scale-[.98]"
              onClick={startGame}
            >
              {GAME_CONFIG.START_BUTTON_TEXT}
            </button>
            <button
              className="h-14 px-8 rounded-full text-lg font-bold kid-button border border-black/10 bg-[#f0f0f0] active:scale-[.98]"
              onClick={() => (window.location.href = "/")}
            >
              메인으로 돌아가기
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 py-6 rounded-xl bg-black/[.03] dark:bg-white/[.06]">
              <div className="text-6xl font-bold tabular-nums select-none">
                {problem.a} {problem.op} {problem.b} =
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 select-none">
              {options.map((opt) => (
                <button
                  key={opt}
                  className={`h-24 text-4xl rounded-2xl border active:scale-[.98] ${
                    showAnswer && opt === problem.answer
                      ? "border-green-500 bg-green-100 text-green-800"
                      : feedback === "wrong" && opt !== problem.answer
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-black/15 bg-background"
                  }`}
                  onClick={() => submitAnswer(opt)}
                  onKeyDown={onKeyDown}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <label className="flex items-center gap-2 select-none text-sm">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                />
                음성 피드백
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
