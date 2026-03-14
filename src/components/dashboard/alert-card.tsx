import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type AlertCardProps = {
  title: string;
  detail: string;
  time: string;
};

export function AlertCard({ title, detail, time }: AlertCardProps) {
  return (
    <Card className="border-white/70 bg-white/85">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#e8f5f3] p-3">
            <AlertTriangle className="h-5 w-5 text-[#145761]" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold text-[#12343b]">{title}</p>
              <span className="whitespace-nowrap text-xs uppercase tracking-[0.2em] text-[#6b8f92]">
                {time}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#55797c]">{detail}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
