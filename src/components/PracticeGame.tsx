"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GAME_CONFIG } from "../constants/game";

type Problem = {
  a: number;
  b: number;
  op: "+" | "-";
  answer: number;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDigitRange(digits: number): [number, number] {
  if (digits <= 1) return [0, 9];
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return [min, max];
}

function generateProblem(digits: number): Problem {
  const operator: "+" | "-" = Math.random() < 0.5 ? "+" : "-";

  const [min, max] = getDigitRange(digits);

  if (operator === "+") {
    const a = getRandomInt(min, max);
    const b = getRandomInt(min, max);
    return { a, b, op: "+", answer: a + b };
  }

  // subtraction: ensure non-negative result
  let a = getRandomInt(min, max);
  let b = getRandomInt(min, max);
  if (b > a) [a, b] = [b, a];
  return { a, b, op: "-", answer: a - b };
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
  digits: number;
};

export default function PracticeGame({ digits }: PracticeGameProps) {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState<Problem>(() =>
    getDefaultProblem(digits)
  );
  const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);
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
    // On first client mount or when digits change while not running,
    // create a new random problem only on the client to avoid hydration mismatch
    if (!running) {
      const p = generateProblem(digits);
      setProblem(p);
      setFeedback(null);
      buildOptions(p);
    }
  }, [digits, running, buildOptions]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

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
    const p = generateProblem(digits);
    setProblem(p);
    setFeedback(null);
    buildOptions(p);
    setRunning(true);
  }, [digits, buildOptions]);

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
        const next = generateProblem(digits);
        setProblem(next);
        buildOptions(next);
      } else {
        setStreak(0);
        // 즉시 다음 문제로 이동하며 시각적 오답 상태를 남기지 않음
        try {
          if ("vibrate" in navigator) {
            navigator.vibrate?.(60);
          }
        } catch {}
        say("틀렸어요");
        const next = generateProblem(digits);
        setProblem(next);
        buildOptions(next);
        setFeedback(null);
      }
    },
    [digits, problem.answer, running, say, streak, buildOptions]
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
    }
  }, []);

  const title = useMemo(() => {
    const base = digitsLabelKorean(digits);
    return `${base} 덧셈·뺄셈`;
  }, [digits]);

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

        {!running ? (
          <div className="flex items-center justify-center py-10">
            <button
              className="h-14 px-8 rounded-full text-lg font-bold kid-button border border-black/10 bg-[#e7f7ea] active:scale-[.98]"
              onClick={startGame}
            >
              {GAME_CONFIG.START_BUTTON_TEXT}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 py-6 rounded-xl bg-black/[.03] dark:bg-white/[.06]">
              <div className="text-6xl font-bold tabular-nums select-none">
                {problem.a} {problem.op} {problem.b} =
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 select-none">
              {options.map((opt) => (
                <button
                  key={opt}
                  className={`h-16 text-2xl rounded-2xl border active:scale-[.98] ${
                    feedback === "wrong" && opt !== problem.answer
                      ? "border-black/10 bg-background"
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
