import { createClient } from "@/lib/supabase/server";

export interface Player {
    id: string;
    full_name: string | null;
    position: string | null;
    height_ft: number | null;
    height_in: number | null;
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
        height_ft,
        height_in,
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
 * Balance players into two teams using enhanced algorithm
 * Considers: position, height, skill level, and reliability
 * @param players - Array of players to balance
 * @returns Two balanced teams
 */
function balanceTeams(players: Player[]): TeamAssignment[] {
    // Helper: Calculate height in inches
    const getHeightInInches = (player: Player): number => {
        const ft = player.height_ft || 0;
        const inches = player.height_in || 0;
        return ft * 12 + inches;
    };

    // Helper: Get numeric skill value
    const getSkillValue = (skillLevel: string | null): number => {
        const skillOrder = { Elite: 4, Competitive: 3, Casual: 2, Beginner: 1 };
        return skillOrder[skillLevel as keyof typeof skillOrder] || 0;
    };

    // Helper: Normalize position
    const normalizePosition = (position: string | null): string => {
        if (!position) return 'Unknown';
        const pos = position.toLowerCase();
        if (pos.includes('guard') || pos.includes('pg') || pos.includes('sg')) return 'Guard';
        if (pos.includes('forward') || pos.includes('sf') || pos.includes('pf')) return 'Forward';
        if (pos.includes('center') || pos.includes('c')) return 'Center';
        return 'Unknown';
    };

    // Calculate composite score for each player
    const playersWithScores = players.map(player => {
        const skillValue = getSkillValue(player.skill_level);
        const reliabilityScore = player.reliability_score || 100;
        const heightInches = getHeightInInches(player);

        // Composite score: skill (60%) + reliability (30%) + height factor (10%)
        // Height factor: normalized to 0-4 range (assuming 60-84 inches)
        const heightFactor = Math.min(4, Math.max(0, (heightInches - 60) / 6));
        const compositeScore = (skillValue * 0.6) + (reliabilityScore / 100 * 4 * 0.3) + (heightFactor * 0.1);

        return {
            ...player,
            position: normalizePosition(player.position),
            compositeScore,
            skillValue,
            heightInches
        };
    });

    // Group players by position
    const guards = playersWithScores.filter(p => p.position === 'Guard');
    const forwards = playersWithScores.filter(p => p.position === 'Forward');
    const centers = playersWithScores.filter(p => p.position === 'Center');
    const unknown = playersWithScores.filter(p => p.position === 'Unknown');

    // Sort each position group by composite score (descending)
    const sortByScore = (a: any, b: any) => b.compositeScore - a.compositeScore;
    guards.sort(sortByScore);
    forwards.sort(sortByScore);
    centers.sort(sortByScore);
    unknown.sort(sortByScore);

    const team1: Player[] = [];
    const team2: Player[] = [];

    // Snake draft within each position group
    const snakeDraft = (positionGroup: any[]) => {
        let pickForTeam1 = true;

        positionGroup.forEach((player, index) => {
            if (pickForTeam1) {
                team1.push(player);
            } else {
                team2.push(player);
            }

            // Alternate picks (1-2-2-1 pattern for snake draft)
            if (index === 0 || (index > 0 && positionGroup.length > 2)) {
                pickForTeam1 = !pickForTeam1;
            }
        });
    };

    // Draft players by position to ensure balanced position distribution
    snakeDraft(guards);
    snakeDraft(forwards);
    snakeDraft(centers);
    snakeDraft(unknown);

    // Calculate average skill levels
    const calculateAvgSkill = (team: Player[]) => {
        if (team.length === 0) return 0;
        const total = team.reduce((sum, p) => sum + getSkillValue(p.skill_level), 0);
        return total / team.length;
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

