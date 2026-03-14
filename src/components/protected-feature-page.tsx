import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { roleLabels, type AppRole } from "@/lib/rbac";
import type { UserProfile } from "@/lib/auth";

type ProtectedFeaturePageProps = {
  profile: UserProfile;
  title: string;
  description: string;
  allowedRoles: AppRole[];
  backHref: string;
};

export function ProtectedFeaturePage({
  profile,
  title,
  description,
  allowedRoles,
  backHref
}: ProtectedFeaturePageProps) {
  const displayName = profile.full_name || profile.email;
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/70 bg-white/85">
          <CardHeader>
            <Badge variant="secondary" className="mt-4 w-fit">
              Protected Feature
            </Badge>
            <CardTitle className="mt-3 text-3xl text-[#12343b]">{title}</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7 text-[#55797c]">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-[#55797c]">
            <div className="rounded-2xl bg-[#f8fcfb] p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#12353d] text-lg font-semibold text-white">
                  {initial}
                </div>
                <div>
                  <p className="font-medium text-[#12343b]">Current signed-in user</p>
                  <p className="mt-1">{displayName}</p>
                </div>
              </div>
              <p className="text-[#6d9092]">{profile.email}</p>
            </div>
            <div className="rounded-2xl bg-[#f8fcfb] p-4">
              <p className="font-medium text-[#12343b]">Allowed roles</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {allowedRoles.map((role) => (
                  <Badge key={role} variant="outline">
                    {roleLabels[role]}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-[#f8fcfb] p-4">
              <p className="font-medium text-[#12343b]">Why this page exists</p>
              <p className="mt-2">
                This is a simple route used to prove that middleware and server checks are both
                enforcing the right permissions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/85">
          <CardHeader>
            <CardTitle>Next step</CardTitle>
            <CardDescription>
              Replace this placeholder with the real module when you start building it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href={backHref}>Return to role dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go to home page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
