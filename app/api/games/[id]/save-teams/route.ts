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

        // Verify caller is host
        const { data: game } = await supabase
            .from("games")
            .select("host_id")
            .eq("id", gameId)
            .single();

        if (!game || game.host_id !== user.id) {
            return NextResponse.json({ error: "Only the host can save team assignments" }, { status: 403 });
        }

        const body = await request.json();
        const assignments: { playerId: string; teamNumber: 1 | 2 }[] = body.assignments;

        if (!Array.isArray(assignments) || assignments.length === 0) {
            return NextResponse.json({ error: "No assignments provided" }, { status: 400 });
        }

        // Validate all players are confirmed roster members
        const { data: roster } = await supabase
            .from("game_roster")
            .select("player_id")
            .eq("game_id", gameId)
            .in("status", ["joined", "checked_in"]);

        const confirmedIds = new Set((roster ?? []).map((r: any) => r.player_id));
        const invalid = assignments.filter(a => !confirmedIds.has(a.playerId));
        if (invalid.length > 0) {
            return NextResponse.json({ error: "Some players are not confirmed roster members" }, { status: 400 });
        }

        // Clear existing and insert new
        await supabase.from("team_assignments").delete().eq("game_id", gameId);

        const rows = assignments.map(a => ({
            game_id: gameId,
            player_id: a.playerId,
            team_number: a.teamNumber,
            assigned_by: user.id,
        }));

        const { error: insertError } = await supabase.from("team_assignments").insert(rows);
        if (insertError) {
            return NextResponse.json({ error: "Failed to save assignments" }, { status: 500 });
        }

        // Mark teams as generated and reset published state
        await supabase
            .from("games")
            .update({
                teams_generated: true,
                teams_generated_at: new Date().toISOString(),
                teams_published: false,
                teams_published_at: null,
            })
            .eq("id", gameId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error saving teams:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
