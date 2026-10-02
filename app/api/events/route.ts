import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Supabase events error:", error);

      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? [], { status: 200 });
  } catch (error) {
    console.error("Events API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}