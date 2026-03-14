import { Atom, FlaskConical } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f4650] via-[#12616b] to-[#5fd0c8] text-white shadow-soft">
        <FlaskConical className="h-5 w-5" />
        <Atom className="absolute -right-1 -top-1 h-4 w-4 text-[#d7fffb]" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#4f7a7f]">
          NextGen
        </p>
        <p className="text-lg font-semibold tracking-tight text-[#12343b]">LIMS</p>
      </div>
    </div>
  );
}
