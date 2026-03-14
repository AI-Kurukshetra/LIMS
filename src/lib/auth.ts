import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDashboardPathForRole, isAppRole, type AppRole } from "@/lib/rbac";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  created_at: string;
};

export async function getOptionalSessionProfile() {
  if (!isSupabaseConfigured) {
    return { user: null, profile: null as UserProfile | null };
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null as UserProfile | null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !isAppRole(profile.role)) {
    return { user, profile: null as UserProfile | null };
  }

  return {
    user,
    profile: profile as UserProfile
  };
}

export async function requireUserProfile(allowedRoles?: AppRole[]) {
  const { user, profile } = await getOptionalSessionProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile) {
    redirect("/login");
  }

  // Redirecting to the user's own dashboard is a friendlier fallback than a hard error page.
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    redirect(getDashboardPathForRole(profile.role));
  }

  return { user, profile };
}

// API routes need the same profile lookup logic, but they should return JSON errors instead of redirects.
export async function getApiSessionProfile() {
  const { user, profile } = await getOptionalSessionProfile();

  if (!user || !profile) {
    return null;
  }

  return { user, profile };
}
