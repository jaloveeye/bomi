"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ScoreList from "@/components/ScoreList";
import AnimatedBackground from "@/components/AnimatedBackground";
import LevelProgress from "@/components/LevelProgress";
import AchievementBadge from "@/components/AchievementBadge";
import LevelUpNotification from "@/components/LevelUpNotification";
import AchievementNotification from "@/components/AchievementNotification";
import { useLevelSystem } from "@/hooks/useLevelSystem";

export default function Home() {
  const {
    userProgress,
    showLevelUp,
    showAchievement,
    closeLevelUp,
    closeAchievement,
  } = useLevelSystem();

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 페이지 로드 시 자동 재생 시도
  useEffect(() => {
    const tryAutoPlay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsMusicPlaying(true);
        } catch {
          // 자동 재생이 차단된 경우 사용자 상호작용 대기
          console.log(
            "자동 재생이 차단되었습니다. 사용자 상호작용을 기다립니다."
          );

          const handleFirstInteraction = () => {
            if (!isMusicPlaying && audioRef.current) {
              playBomiSong();
            }
          };

          // 다양한 상호작용 이벤트 리스너 추가
          document.addEventListener("click", handleFirstInteraction, {
            once: true,
          });
          document.addEventListener("touchstart", handleFirstInteraction, {
            once: true,
          });
          document.addEventListener("keydown", handleFirstInteraction, {
            once: true,
          });

          return () => {
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("touchstart", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);
          };
        }
      }
    };

    // 페이지 로드 후 약간의 지연을 두고 자동 재생 시도
    const timer = setTimeout(tryAutoPlay, 500);

    return () => clearTimeout(timer);
  }, [isMusicPlaying]);

  // 오디오 요소 로드 완료 시 자동 재생 시도
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = async () => {
      try {
        await audio.play();
        setIsMusicPlaying(true);
      } catch (error) {
        console.log("오디오 로드 후 자동 재생 실패:", error);
      }
    };

    const handleLoadedData = async () => {
      try {
        await audio.play();
        setIsMusicPlaying(true);
      } catch (error) {
        console.log("오디오 데이터 로드 후 자동 재생 실패:", error);
      }
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadeddata", handleLoadedData);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  const playBomiSong = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsMusicPlaying(true);
    }
  };

  const stopBomiSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center p-4 md:p-6 relative">
      <AnimatedBackground />

      {/* 배경음악 오디오 요소 */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        autoPlay
        muted={false}
        className="hidden"
      >
        <source src="/bomi-song.m4a" type="audio/mp4" />
        <source src="/bomi-song.mp3" type="audio/mpeg" />
        브라우저가 오디오를 지원하지 않습니다.
      </audio>

      {/* 음악 컨트롤 버튼 */}
      <div className="fixed top-4 right-4 z-20">
        <button
          onClick={isMusicPlaying ? stopBomiSong : playBomiSong}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            isMusicPlaying
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          title={isMusicPlaying ? "음악 정지" : "음악 재생"}
        >
          {isMusicPlaying ? "⏸️" : "🎵"}
        </button>
      </div>

      <main className="w-full max-w-[720px] text-center relative z-10 pt-8 md:pt-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight">
          보미의 즐거운 수학 놀이
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-10">
          하기 쉬운 문제부터 천천히 해볼까요?
        </p>

        {/* 레벨 진행도 */}
        <div className="mb-6 md:mb-8">
          <LevelProgress userProgress={userProgress} showDetails={true} />
        </div>

        {/* 보미 캐릭터 이미지 */}
        <div className="mb-6 md:mb-8">
          <div className="animate-float">
            <Image
              src="/bomi-character.png"
              alt="보미 캐릭터"
              width={200}
              height={250}
              className="w-48 h-60 md:w-56 md:h-70 object-cover rounded-2xl shadow-2xl opacity-90 mx-auto"
              style={{
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
              }}
              priority
            />
          </div>
        </div>

        {/* 스토리 모드 */}
        <div className="mb-6 md:mb-8">
          <Link
            className="block rounded-2xl p-4 md:p-6 lg:p-8 border border-[#ffb3ba] bg-[#ffe0e6] hover:bg-[#ffd1d9] active:bg-[#ffc2cc] transition-colors text-xl md:text-2xl lg:text-3xl kid-button"
            href="/story"
          >
            🏞️ 보미의 모험 이야기
          </Link>
        </div>

        {/* 패턴 인식 게임 */}
        <div className="mb-6 md:mb-8">
          <Link
            className="block rounded-2xl p-4 md:p-6 lg:p-8 border border-[#a8e6cf] bg-[#d4f1e8] hover:bg-[#c4ebd8] active:bg-[#b4e5c8] transition-colors text-xl md:text-2xl lg:text-3xl kid-button"
            href="/pattern"
          >
            🔍 패턴 찾기 게임
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Link
            className="block rounded-2xl p-4 md:p-6 lg:p-8 border border-[#bfe7c8] bg-[#e7f7ea] hover:bg-[#d7f1de] active:bg-[#c7ebd2] transition-colors text-xl md:text-2xl lg:text-3xl kid-button"
            href="/practice/1-digit"
          >
            1자리 덧셈·뺄셈
          </Link>
          <Link
            className="block rounded-2xl p-4 md:p-6 lg:p-8 border border-[#bfe7c8] bg-[#e7f7ea] hover:bg-[#d7f1de] active:bg-[#c7ebd2] transition-colors text-xl md:text-2xl lg:text-3xl kid-button"
            href="/practice/2-digit"
          >
            2자리 덧셈·뺄셈
          </Link>
        </div>

        <div className="mt-6 md:mt-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            구구단 연습
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[2, 3, 4, 5, 6, 7, 8, 9].map((table) => (
              <Link
                key={table}
                className="block rounded-xl p-3 md:p-4 border border-[#bfe7c8] bg-[#e7f7ea] hover:bg-[#d7f1de] active:bg-[#c7ebd2] transition-colors text-lg md:text-xl lg:text-2xl kid-button text-center"
                href={`/practice/multiplication/${table}-table`}
              >
                {table}단
              </Link>
            ))}
          </div>
        </div>

        <ScoreList />

        {/* 성취 배지 섹션 */}
        <div className="mt-8 md:mt-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            🏆 성취 배지
          </h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3 md:gap-4">
            {userProgress.achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                size="small"
              />
            ))}
          </div>
        </div>
      </main>

      {/* 레벨업 알림 */}
      {showLevelUp && (
        <LevelUpNotification
          newLevel={userProgress.level}
          onClose={closeLevelUp}
        />
      )}

      {/* 성취 알림 */}
      {showAchievement && (
        <AchievementNotification
          achievement={showAchievement}
          onClose={closeAchievement}
        />
      )}
    </div>
  );
}
