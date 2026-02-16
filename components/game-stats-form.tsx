"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { TrendingUp } from "lucide-react";

interface GameStatsFormProps {
    gameId: string;
    playerId: string;
    existingStats?: {
        points: number;
        rebounds: number;
        assists: number;
        steals: number;
        blocks: number;
        turnovers: number;
    } | null;
    onSuccess?: () => void;
}

export function GameStatsForm({ gameId, playerId, existingStats, onSuccess }: GameStatsFormProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        points: existingStats?.points || 0,
        rebounds: existingStats?.rebounds || 0,
        assists: existingStats?.assists || 0,
        steals: existingStats?.steals || 0,
        blocks: existingStats?.blocks || 0,
        turnovers: existingStats?.turnovers || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (existingStats) {
                // Update existing stats
                const { error } = await supabase
                    .from("game_stats")
                    .update({
                        ...stats,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("game_id", gameId)
                    .eq("player_id", playerId);

                if (error) throw error;
            } else {
                // Insert new stats
                const { error } = await supabase
                    .from("game_stats")
                    .insert({
                        game_id: gameId,
                        player_id: playerId,
                        ...stats,
                    });

                if (error) throw error;
            }

            alert("Stats saved successfully!");
            onSuccess?.();
        } catch (error: any) {
            console.error("Error saving stats:", error);
            alert(error.message || "Failed to save stats");
        } finally {
            setLoading(false);
        }
    };

    const StatInput = ({ label, name, max }: { label: string; name: keyof typeof stats; max: number }) => (
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {label}
            </label>
            <input
                type="number"
                min="0"
                max={max}
                value={stats[name]}
                onChange={(e) => setStats({ ...stats, [name]: Math.min(max, Math.max(0, Number(e.target.value))) })}
                className="w-full h-12 bg-zinc-900/50 border border-white/10 rounded-xl px-4 text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all input-premium"
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="glass-card-premium p-6 rounded-2xl space-y-6 border border-white/10">
            <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    {existingStats ? "Edit Your Stats" : "Add Your Stats"}
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatInput label="Points" name="points" max={100} />
                <StatInput label="Rebounds" name="rebounds" max={50} />
                <StatInput label="Assists" name="assists" max={50} />
                <StatInput label="Steals" name="steals" max={20} />
                <StatInput label="Blocks" name="blocks" max={20} />
                <StatInput label="Turnovers" name="turnovers" max={20} />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary to-[#E8A966] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shimmer-btn btn-glow"
            >
                {loading ? "Saving..." : existingStats ? "Update Stats" : "Save Stats"}
            </button>
        </form>
    );
}
