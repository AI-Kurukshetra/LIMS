"use client";

import { useRouter } from "next/navigation";

import {
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();

    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenuItem
      onSelect={(event) => {
        event.preventDefault();
        void handleSignOut();
      }}
    >
      Sign out
    </DropdownMenuItem>
  );
}
