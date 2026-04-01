import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id: gameId } = await params;

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify caller is host and get current game state
        const { data: game } = await supabase
            .from("games")
            .select("host_id, teams_generated")
            .eq("id", gameId)
            .single();

        if (!game || game.host_id !== user.id) {
            return NextResponse.json({ error: "Only the host can publish teams" }, { status: 403 });
        }

        const { publish }: { publish: boolean } = await request.json();

        if (publish && !game.teams_generated) {
            return NextResponse.json({ error: "Save a lineup before publishing" }, { status: 400 });
        }

        await supabase
            .from("games")
            .update({
                teams_published: publish,
                teams_published_at: publish ? new Date().toISOString() : null,
            })
            .eq("id", gameId);

        return NextResponse.json({ success: true, published: publish });
    } catch (error: any) {
        console.error("Error publishing teams:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
