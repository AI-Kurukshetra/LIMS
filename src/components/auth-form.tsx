"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  appRoles,
  getDashboardPathForRole,
  isAppRole,
  roleLabels,
  type AppRole
} from "@/lib/rbac";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AppRole | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  async function resolveDashboardPath(
    supabase: SupabaseClient,
    user: User,
    fallbackRole?: AppRole
  ): Promise<{ path: string; role: AppRole } | { path: null; error: string }> {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return {
        path: null,
        error: `Profile lookup failed: ${profileError.message}`
      };
    }

    if (profile && isAppRole(profile.role)) {
      return { path: getDashboardPathForRole(profile.role), role: profile.role };
    }

    if (fallbackRole) {
      return { path: getDashboardPathForRole(fallbackRole), role: fallbackRole };
    }

    const metadataRole = user.user_metadata?.role;

    if (isAppRole(metadataRole)) {
      return { path: getDashboardPathForRole(metadataRole), role: metadataRole };
    }

    return {
      path: null,
      error:
        "No role in database (`profiles`) and none in account metadata. Add a profiles row for this user (e.g. role lab_manager) or re-register with a role."
    };
  }

  /** Server must see session + profile or middleware will send user back to login. */
  async function resolveDashboardViaServer(): Promise<
    { ok: true; path: string; role: AppRole } | { ok: false; error: string }
  > {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 200 * attempt));
      }
      const res = await fetch("/api/auth/resolve-dashboard", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" }
      });
      const body = (await res.json()) as {
        ok?: boolean;
        path?: string;
        role?: string;
        error?: string;
      };
      if (res.ok && body.ok && body.path && body.role && isAppRole(body.role)) {
        return { ok: true, path: body.path, role: body.role };
      }
      if (res.status !== 401) {
        return { ok: false, error: body.error ?? "Could not confirm role after login." };
      }
    }
    return {
      ok: false,
      error:
        "Server still does not see your session (cookies). Try again, disable blockers, or use another browser."
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage("Add Supabase environment variables before enabling auth flows.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (mode === "signup" && !fullName.trim()) {
      setErrorMessage("Enter the user's full name.");
      return;
    }

    if (mode === "signup" && !role) {
      setErrorMessage("Select a role before creating the account.");
      return;
    }

    setIsPending(true);

    const supabase = createSupabaseBrowserClient();

    if (mode === "login") {
      // Sign in first; role must come from `profiles` (and server cookies) so middleware allows the dashboard.
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setIsPending(false);
        setErrorMessage(error.message);
        return;
      }

      if (!data.user) {
        setIsPending(false);
        setErrorMessage("Sign-in succeeded but no user was returned. Try again.");
        return;
      }

      await supabase.auth.getSession();

      const serverResult = await resolveDashboardViaServer();
      if (serverResult.ok) {
        setIsPending(false);
        window.location.replace(serverResult.path);
        return;
      }

      const clientResult = await resolveDashboardPath(supabase, data.user);
      setIsPending(false);

      if ("path" in clientResult && clientResult.path) {
        setErrorMessage(
          `${serverResult.error} You have role "${clientResult.role}" in the browser, but the app server did not see your session yet—try Login again once, or clear site data for this origin.`
        );
        return;
      }

      setErrorMessage(
        clientResult.path === null && "error" in clientResult
          ? `${clientResult.error} (${serverResult.error})`
          : serverResult.error
      );
      return;
    }

    // Store the role in user metadata so the database trigger can create the matching profile.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role
        }
      }
    });

    if (error) {
      setIsPending(false);
      setErrorMessage(error.message);
      return;
    }

    if (data.user) {
      // The database trigger creates the profile row from auth.users, so the browser does not
      // need to write to the profiles table directly.
      // Keep signup and login as two separate steps, even when Supabase returns a session.
      if (data.session) {
        await supabase.auth.signOut();
      }

      setIsPending(false);
      setMode("login");
      setEmail("");
      setFullName("");
      setRole("");
      setPassword("");
      setConfirmPassword("");
      setSuccessMessage("Registration successful. Please log in with your new account.");
      return;
    }

    setIsPending(false);
    setMode("login");
    setEmail("");
    setFullName("");
    setRole("");
    setPassword("");
    setConfirmPassword("");
    setSuccessMessage("Registration successful. Please log in with your new account.");
  }

  const isSignup = mode === "signup";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            !isSignup ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
          )}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            isSignup ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
          )}
        >
          Sign Up
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {isSignup ? (
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Dr. Anika Rao"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="email">Work Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="scientist@nextgen-lims.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        {isSignup ? (
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as AppRole | "")}
              required
            >
              <option value="">Select Role</option>
              {appRoles.map((appRole) => (
                <option key={appRole} value={appRole}>
                  {roleLabels[appRole]}
                </option>
              ))}
            </Select>
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="Enter a secure password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </div>
        {isSignup ? (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            {errorMessage}
          </div>
        ) : null}
        {successMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            {successMessage}
          </div>
        ) : null}
        <Button className="w-full" size="lg" type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : isSignup ? "Create Account" : "Login"}
        </Button>
      </form>
    </div>
  );
}
