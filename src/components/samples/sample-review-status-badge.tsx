import { Badge } from "@/components/ui/badge";
import { getSampleReviewStatusLabel, type SampleReviewStatus } from "@/lib/samples";

type SampleReviewStatusBadgeProps = {
  status: SampleReviewStatus;
};

const statusClasses: Record<SampleReviewStatus, string> = {
  reviewed: "border-sky-200 bg-sky-50 text-sky-700",
  needs_changes: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700"
};

export function SampleReviewStatusBadge({ status }: SampleReviewStatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusClasses[status]}>
      {getSampleReviewStatusLabel(status)}
    </Badge>
  );
}
