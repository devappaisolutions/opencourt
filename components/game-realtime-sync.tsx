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

        // Only subscribe to `games` — it has a public SELECT policy (USING TRUE).
        // team_assignments has an RLS policy that blocks non-hosts when teams are
        // unpublished, causing Supabase Realtime to return UNAUTHORIZED.
        // Subscribing to `games` alone is sufficient: when the host publishes,
        // games.teams_published changes, this fires, router.refresh() re-fetches
        // the server component which then queries team_assignments (now accessible).
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
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameId, router]);

    return null;
}
