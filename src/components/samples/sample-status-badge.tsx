import { Badge } from "@/components/ui/badge";
import { getSampleStatusLabel, type SampleStatus } from "@/lib/samples";

type SampleStatusBadgeProps = {
  status: SampleStatus;
};

const statusClasses: Record<SampleStatus, string> = {
  received: "border-sky-200 bg-sky-50 text-sky-700",
  in_testing: "border-amber-200 bg-amber-50 text-amber-700",
  qc_review: "border-violet-200 bg-violet-50 text-violet-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-teal-200 bg-teal-50 text-teal-700"
};

export function SampleStatusBadge({ status }: SampleStatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusClasses[status]}>
      {getSampleStatusLabel(status)}
    </Badge>
  );
}
