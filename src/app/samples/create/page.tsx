import Link from "next/link";

import { SampleCreateForm } from "@/components/samples/sample-create-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSampleFormOptions } from "@/lib/samples";

export default async function CreateSamplePage() {
  await requireUserProfile(["lab_manager"]);

  const supabase = createSupabaseServerClient();
  const { clients, scientists } = await getSampleFormOptions(supabase);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#12343b]">Create Sample</h1>
          <p className="mt-2 text-sm leading-6 text-[#55797c]">
            Register a sample, connect it to a client, and optionally assign a scientist.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/samples">Back to samples</Link>
        </Button>
      </div>

      {clients.length === 0 ? (
        <Card className="border-white/70 bg-white/85">
          <CardContent className="p-6 text-sm leading-6 text-[#55797c]">
            No client profiles were found. Create at least one user with the `client` role before
            registering samples.
          </CardContent>
        </Card>
      ) : (
        <SampleCreateForm clients={clients} scientists={scientists} />
      )}
    </div>
  );
}
