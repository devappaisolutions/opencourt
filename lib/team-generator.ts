import { createClient } from "@/lib/supabase/server";

export interface Player {
    id: string;
    full_name: string | null;
    position: string | null;
    skill_level: string | null;
    reliability_score: number;
}

export interface TeamAssignment {
    team_number: number;
    players: Player[];
    avg_skill: number;
}

/**
 * Generate balanced teams for a game
 * @param gameId - The game ID to generate teams for
 * @returns Team assignments or error
 */
export async function generateTeams(gameId: string, hostId: string) {
    const supabase = await createClient();

    // 1. Get game details
    const { data: game, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

    if (gameError || !game) {
        return { error: "Game not found" };
    }

    // Verify host
    if (game.host_id !== hostId) {
        return { error: "Only the host can generate teams" };
    }

    // 2. Get all checked-in players
    const { data: roster, error: rosterError } = await supabase
        .from("game_roster")
        .select(`
      player_id,
      profiles (
        id,
        full_name,
        position,
        skill_level,
        reliability_score
      )
    `)
        .eq("game_id", gameId)
        .eq("status", "checked_in");

    if (rosterError || !roster || roster.length === 0) {
        return { error: "No checked-in players found" };
    }

    // Extract player data
    const players: Player[] = roster
        .map((r: any) => r.profiles)
        .filter((p: any) => p !== null);

    if (players.length < 2) {
        return { error: "Need at least 2 players to generate teams" };
    }

    // 3. Balance teams
    const teams = balanceTeams(players);

    // 4. Clear existing team assignments
    await supabase
        .from("team_assignments")
        .delete()
        .eq("game_id", gameId);

    // 5. Insert new team assignments
    const assignments = teams.flatMap((team) =>
        team.players.map((player) => ({
            game_id: gameId,
            player_id: player.id,
            team_number: team.team_number,
            assigned_by: hostId,
        }))
    );

    const { error: insertError } = await supabase
        .from("team_assignments")
        .insert(assignments);

    if (insertError) {
        return { error: "Failed to save team assignments" };
    }

    // 6. Update game status
    await supabase
        .from("games")
        .update({
            teams_generated: true,
            teams_generated_at: new Date().toISOString(),
        })
        .eq("id", gameId);

    return { teams, success: true };
}

/**
 * Balance players into two teams using snake draft algorithm
 * @param players - Array of players to balance
 * @returns Two balanced teams
 */
function balanceTeams(players: Player[]): TeamAssignment[] {
    // Sort players by skill level and reliability
    const sortedPlayers = [...players].sort((a, b) => {
        const skillOrder = { Elite: 4, Competitive: 3, Casual: 2, Beginner: 1 };
        const aSkill = skillOrder[a.skill_level as keyof typeof skillOrder] || 0;
        const bSkill = skillOrder[b.skill_level as keyof typeof skillOrder] || 0;

        if (aSkill !== bSkill) return bSkill - aSkill;
        return (b.reliability_score || 0) - (a.reliability_score || 0);
    });

    const team1: Player[] = [];
    const team2: Player[] = [];

    // Snake draft: 1-2-2-1-1-2-2-1...
    let pickForTeam1 = true;
    let consecutivePicks = 1;

    sortedPlayers.forEach((player, index) => {
        if (pickForTeam1) {
            team1.push(player);
        } else {
            team2.push(player);
        }

        consecutivePicks--;
        if (consecutivePicks === 0) {
            pickForTeam1 = !pickForTeam1;
            consecutivePicks = index === 0 ? 2 : pickForTeam1 ? 1 : 2;
        }
    });

    // Calculate average skill levels
    const calculateAvgSkill = (team: Player[]) => {
        const skillValues = { Elite: 4, Competitive: 3, Casual: 2, Beginner: 1 };
        const total = team.reduce((sum, p) => {
            return sum + (skillValues[p.skill_level as keyof typeof skillValues] || 0);
        }, 0);
        return team.length > 0 ? total / team.length : 0;
    };

    return [
        {
            team_number: 1,
            players: team1,
            avg_skill: calculateAvgSkill(team1),
        },
        {
            team_number: 2,
            players: team2,
            avg_skill: calculateAvgSkill(team2),
        },
    ];
}
