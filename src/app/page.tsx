import Link from "next/link";
import ScoreList from "@/components/ScoreList";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <main className="w-full max-w-[720px] text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          보미의 즐거운 수학 놀이
        </h1>
        <p className="text-xl md:text-2xl mb-10">
          하기 쉬운 문제부터 천천히 해볼까요?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            className="block rounded-2xl p-6 md:p-8 border border-[#bfe7c8] bg-[#e7f7ea] hover:bg-[#d7f1de] active:bg-[#c7ebd2] transition-colors text-2xl md:text-3xl kid-button"
            href="/practice/1-digit"
          >
            1자리 덧셈·뺄셈
          </Link>
          <Link
            className="block rounded-2xl p-6 md:p-8 border border-[#bfe7c8] bg-[#e7f7ea] hover:bg-[#d7f1de] active:bg-[#c7ebd2] transition-colors text-2xl md:text-3xl kid-button"
            href="/practice/2-digit"
          >
            2자리 덧셈·뺄셈
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">구구단 연습</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[2, 3, 4, 5, 6, 7, 8, 9].map((table) => (
              <Link
                key={table}
                className="block rounded-xl p-4 border border-[#bfe7c8] bg-[#e7f7ea] hover:bg-[#d7f1de] active:bg-[#c7ebd2] transition-colors text-xl md:text-2xl kid-button text-center"
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
