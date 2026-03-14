import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getDashboardPathForRole, isAppRole } from "@/lib/rbac";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * After client sign-in, confirms the server sees the session and loads `profiles.role`
 * so redirects match what middleware will allow. Returns dashboard path or a clear error.
 */
export async function POST() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured on the server." },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          /* ignore in Route Handler when cookies are read-only */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          /* ignore */
        }
      }
    }
  });

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Your session was not saved for the app (browser cookies). Enable cookies or try again. If this persists, sign out everywhere and sign in once more."
      },
      { status: 401 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      {
        ok: false,
        error: `Could not load your profile: ${profileError.message}. Check Supabase RLS and that the profiles table exists.`
      },
      { status: 500 }
    );
  }

  if (!profile || !isAppRole(profile.role)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Your account signed in, but no valid role was found in `profiles`. Run the RBAC migration, ensure a row exists for your user id with role `lab_manager` (or your role), then try again."
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    role: profile.role,
    path: getDashboardPathForRole(profile.role)
  });
}
