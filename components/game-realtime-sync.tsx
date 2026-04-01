"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface GameRealtimeSyncProps {
    gameId: string;
}

/**
 * Invisible component that subscribes to game-level real-time changes and
 * triggers a server component refresh when data changes.
 *
 * Covers tables not already handled by other components:
 *   - games            (status, teams_published, current_players, etc.)
 *   - team_assignments (team lineup changes)
 */
export function GameRealtimeSync({ gameId }: GameRealtimeSyncProps) {
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel(`game_detail_${gameId}`)
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "games",
                filter: `id=eq.${gameId}`,
            }, () => {
                router.refresh();
            })
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "team_assignments",
                filter: `game_id=eq.${gameId}`,
            }, () => {
                router.refresh();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameId, router, supabase]);

    return null;
}
