import { NextResponse } from "next/server";

import { getApiSessionProfile } from "@/lib/auth";
import { searchRecords } from "@/lib/samples";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const session = await getApiSessionProfile();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["lab_manager", "scientist", "client"].includes(session.profile.role)) {
    return NextResponse.json({ error: "Search is not available for this role yet." }, { status: 403 });
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ data: [], exactMatchId: null });
  }

  const supabase = createSupabaseServerClient();
  const { data, error, exactMatchId } = await searchRecords(supabase, session.profile, {
    searchTerm: query,
    limit: 20
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data, exactMatchId });
}
