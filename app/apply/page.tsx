import ApplyClient from "./ApplyClient";

type AgeBand = "under50" | "51to80";
type OccCategory = "A" | "B";

interface PageProps {
  searchParams: Promise<{
    plan?: string;
    age?: string;
    occ?: string;
  }>;
}

export default async function ApplyPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const planId = Math.max(1, Math.min(9, parseInt(params.plan ?? "1") || 1));
  const ageBand: AgeBand = params.age === "51to80" ? "51to80" : "under50";
  const occCategory: OccCategory = params.occ === "B" ? "B" : "A";

  return (
    <ApplyClient
      planId={planId}
      ageBand={ageBand}
      occCategory={occCategory}
    />
  );
}
