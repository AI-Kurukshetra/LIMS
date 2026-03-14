import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  note: string;
};

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <Card className="border-white/70 bg-white/85">
      <CardContent className="p-5">
        <p className="text-sm text-[#6b8f92]">{label}</p>
        <p className="mt-3 text-3xl font-semibold text-[#12343b]">{value}</p>
        <p className="mt-2 text-sm text-[#55797c]">{note}</p>
      </CardContent>
    </Card>
  );
}
