import { createClient } from "@/lib/supabase/server";

export interface Player {
    id: string;
    full_name: string | null;
    position: string | null;
    height_ft: number | null;
    height_in: number | null;
    skill_level: string | null;
    reliability_score: number;
    avg_points: number;
    avg_rebounds: number;
    avg_assists: number;
    avg_steals: number;
    avg_blocks: number;
    avg_turnovers: number;
}

export interface TeamAssignment {
    team_number: number;
    players: (Player & { ovr: number })[];
    avg_ovr: number;
}

/**
 * Calculate OVR (Overall Rating) for a player based on stats and skill level.
 * Returns a value from 0-100.
 */
export function calculateOVR(player: Player): number {
    const hasStats = (player.avg_points || 0) > 0 ||
        (player.avg_rebounds || 0) > 0 ||
        (player.avg_assists || 0) > 0 ||
        (player.avg_steals || 0) > 0 ||
        (player.avg_blocks || 0) > 0;

    // Skill level modifier
    const skillModifier: Record<string, number> = {
        Elite: 20,
        Competitive: 15,
        Casual: 10,
        Beginner: 5,
    };
    const skillBonus = skillModifier[player.skill_level || ''] ?? 5;

    // If player has no stats, fall back to skill-level-only rating
    if (!hasStats) {
        const skillOnlyRating: Record<string, number> = {
            Elite: 80,
            Competitive: 60,
            Casual: 40,
            Beginner: 20,
        };
        return skillOnlyRating[player.skill_level || ''] ?? 30;
    }

    // Stat score: each stat normalized to its max, then weighted
    const statScore =
        ((player.avg_points || 0) / 100) * 35 +
        ((player.avg_rebounds || 0) / 50) * 15 +
        ((player.avg_assists || 0) / 50) * 20 +
        ((player.avg_steals || 0) / 20) * 10 +
        ((player.avg_blocks || 0) / 20) * 10 -
        ((player.avg_turnovers || 0) / 20) * 10;

    const ovr = statScore + skillBonus;
    return Math.max(0, Math.min(100, Math.round(ovr)));
}

/**
 * Generate balanced teams for a game
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

    // 2. Get all confirmed players (joined or checked-in)
    const { data: roster, error: rosterError } = await supabase
        .from("game_roster")
        .select(`
            player_id,
            profiles (
                id,
                full_name,
                position,
                height_ft,
                height_in,
                skill_level,
                reliability_score,
                avg_points,
                avg_rebounds,
                avg_assists,
                avg_steals,
                avg_blocks,
                avg_turnovers
            )
        `)
        .eq("game_id", gameId)
        .in("status", ["joined", "checked_in"]);

    if (rosterError || !roster || roster.length === 0) {
        return { error: "No confirmed players found" };
    }

    // Extract player data
    const players: Player[] = roster
        .map((r: any) => r.profiles)
        .filter((p: any) => p !== null);

    if (players.length < 4) {
        return { error: "Need at least 4 confirmed players to generate teams" };
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

    // 6. Best-effort: update game flags. Non-fatal because page.tsx now derives
    // team state from actual team_assignments rows, not the teams_generated flag.
    await supabase
        .from("games")
        .update({
            teams_generated: true,
            teams_generated_at: new Date().toISOString(),
            teams_published: false,
            teams_published_at: null,
        })
        .eq("id", gameId);

    return { teams, success: true };
}

/**
 * Balance players into two teams using OVR-based algorithm.
 * 1. Calculate OVR for each player
 * 2. Sort by OVR descending
 * 3. Snake draft (1-2-2-1-1-2...) for initial assignment
 * 4. Swap optimization pass to minimize OVR gap between teams
 */
function balanceTeams(players: Player[]): TeamAssignment[] {
    // Calculate OVR for each player
    const playersWithOVR = players.map(player => ({
        ...player,
        ovr: calculateOVR(player),
    }));

    // Sort by OVR descending
    playersWithOVR.sort((a, b) => b.ovr - a.ovr);

    // Snake draft: 1-2-2-1-1-2-2-1...
    const team1: (Player & { ovr: number })[] = [];
    const team2: (Player & { ovr: number })[] = [];

    playersWithOVR.forEach((player, index) => {
        // Snake pattern: round = floor(index / 2), even rounds -> team based on index parity
        const round = Math.floor(index / 2);
        const isEvenRound = round % 2 === 0;

        if (index % 2 === 0) {
            (isEvenRound ? team1 : team2).push(player);
        } else {
            (isEvenRound ? team2 : team1).push(player);
        }
    });

    // Swap optimization: try swapping players between teams to reduce OVR gap
    const getTeamOVR = (team: { ovr: number }[]) =>
        team.reduce((sum, p) => sum + p.ovr, 0);

    let improved = true;
    while (improved) {
        improved = false;
        const diff = Math.abs(getTeamOVR(team1) - getTeamOVR(team2));

        for (let i = 0; i < team1.length; i++) {
            for (let j = 0; j < team2.length; j++) {
                // Try swapping team1[i] with team2[j]
                const newTeam1OVR = getTeamOVR(team1) - team1[i].ovr + team2[j].ovr;
                const newTeam2OVR = getTeamOVR(team2) - team2[j].ovr + team1[i].ovr;
                const newDiff = Math.abs(newTeam1OVR - newTeam2OVR);

                if (newDiff < diff) {
                    // Swap
                    const temp = team1[i];
                    team1[i] = team2[j];
                    team2[j] = temp;
                    improved = true;
                    break;
                }
            }
            if (improved) break;
        }
    }

    const avgOVR = (team: { ovr: number }[]) =>
        team.length === 0 ? 0 : Math.round(team.reduce((sum, p) => sum + p.ovr, 0) / team.length);

    return [
        {
            team_number: 1,
            players: team1,
            avg_ovr: avgOVR(team1),
        },
        {
            team_number: 2,
            players: team2,
            avg_ovr: avgOVR(team2),
        },
    ];
}
