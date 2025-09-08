import PracticeGame from "@/components/PracticeGame";

type Props = {
  params: Promise<{ table: string }>;
};

export default async function MultiplicationPage({ params }: Props) {
  const resolved = await params;
  const tableParam = resolved.table;

  const table = (() => {
    const m = tableParam.match(/(\d+)-table/);
    if (!m) return 2;
    const n = Number.parseInt(m[1], 10);
    return Number.isNaN(n) ? 2 : Math.max(2, Math.min(9, n));
  })();

  return <PracticeGame multiplicationTable={table} />;
}
