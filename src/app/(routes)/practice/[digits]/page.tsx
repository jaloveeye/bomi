import PracticeGame from "@/components/PracticeGame";

type Props = {
  params: Promise<{ digits: string }>;
};

export default async function PracticePage({ params }: Props) {
  const resolved = await params;
  const digitsParam = resolved.digits;

  const digits = (() => {
    const m = digitsParam.match(/(\d+)-digit/);
    if (!m) return 1;
    const n = Number.parseInt(m[1], 10);
    return Number.isNaN(n) ? 1 : Math.max(1, Math.min(6, n));
  })();

  return <PracticeGame digits={digits} />;
}
