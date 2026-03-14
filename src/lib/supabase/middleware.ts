import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getAccessRuleForPath, getDashboardPathForRole, isAppRole } from "@/lib/rbac";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options
        });

        response = NextResponse.next({
          request
        });

        response.cookies.set({
          name,
          value,
          ...options
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options
        });

        response = NextResponse.next({
          request
        });

        response.cookies.set({
          name,
          value: "",
          ...options
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const accessRule = getAccessRuleForPath(pathname);
  const isLoginPage = pathname === "/login";

  if (!user) {
    if (accessRule) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !isAppRole(profile.role)) {
    if (accessRule) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "?error=profile";
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // Logged-in users should not stay on the login screen once we know their role.
  if (isLoginPage) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = getDashboardPathForRole(profile.role);
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  if (accessRule && !accessRule.allowedRoles.includes(profile.role)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = getDashboardPathForRole(profile.role);
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}
