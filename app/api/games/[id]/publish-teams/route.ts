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
        const { data: game, error: gameError } = await supabase
            .from("games")
            .select("*")
            .eq("id", gameId)
            .single();

        if (gameError || !game) {
            console.error("publish-teams: game query failed", gameError);
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        if (game.host_id !== user.id) {
            return NextResponse.json({ error: "Only the host can publish teams" }, { status: 403 });
        }

        const { publish }: { publish: boolean } = await request.json();

        const { error: updateError } = await supabase
            .from("games")
            .update({
                teams_published: publish,
                teams_published_at: publish ? new Date().toISOString() : null,
            })
            .eq("id", gameId);

        if (updateError) {
            console.error("publish-teams: update failed", updateError);
            return NextResponse.json({ error: "Failed to update publish state — run the teams_published migration in Supabase" }, { status: 500 });
        }

        return NextResponse.json({ success: true, published: publish });
    } catch (error: any) {
        console.error("Error publishing teams:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
