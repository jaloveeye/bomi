import Link from "next/link";
import Image from "next/image";
import ScoreList from "@/components/ScoreList";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center p-4 md:p-6 relative">
      <AnimatedBackground />
      <main className="w-full max-w-[720px] text-center relative z-10 pt-8 md:pt-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight">
          보미의 즐거운 수학 놀이
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-10">
          하기 쉬운 문제부터 천천히 해볼까요?
        </p>

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
      </main>
    </div>
  );
}
