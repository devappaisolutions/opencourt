"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

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
 *
 * Requires both tables to be added to the supabase_realtime publication:
 *   ALTER PUBLICATION supabase_realtime ADD TABLE games;
 *   ALTER PUBLICATION supabase_realtime ADD TABLE team_assignments;
 */
export function GameRealtimeSync({ gameId }: GameRealtimeSyncProps) {
    const supabaseRef = useRef(createClient());
    const router = useRouter();

    useEffect(() => {
        const supabase = supabaseRef.current;

        // `games` and `game_roster` both have SELECT USING (TRUE) — safe to subscribe.
        // `team_assignments` was removed: its RLS blocks non-hosts when unpublished,
        // causing Supabase Realtime to return UNAUTHORIZED.
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
                table: "game_roster",
                filter: `game_id=eq.${gameId}`,
            }, () => {
                router.refresh();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameId, router]);

    return null;
}
