import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ digits: string }>;
};

export default async function LegacyMixRedirectPage({ params }: Props) {
  const resolved = await params;
  const digits = resolved.digits;
  redirect(`/practice/${digits}`);
}
