"use client";

import { Trophy, TrendingUp } from "lucide-react";
import Image from "next/image";

interface PlayerStats {
    player_id: string;
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    };
}

interface GameStatsDisplayProps {
    stats: PlayerStats[];
    currentUserId?: string;
}

export function GameStatsDisplay({ stats, currentUserId }: GameStatsDisplayProps) {
    if (!stats || stats.length === 0) {
        return (
            <div className="glass-card-premium p-8 rounded-2xl border border-white/10 text-center">
                <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 font-medium">No stats recorded yet</p>
            </div>
        );
    }

    // Sort by points (highest first)
    const sortedStats = [...stats].sort((a, b) => b.points - a.points);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    Game Stats
                </h3>
            </div>

            <div className="glass-card-premium rounded-2xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-7 gap-2 p-4 bg-zinc-900/50 border-b border-white/5 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <div className="col-span-2">Player</div>
                    <div className="text-center">PTS</div>
                    <div className="text-center">REB</div>
                    <div className="text-center">AST</div>
                    <div className="text-center">STL</div>
                    <div className="text-center">BLK</div>
                </div>

                {/* Stats Rows */}
                <div className="divide-y divide-white/5">
                    {sortedStats.map((stat, index) => {
                        const isCurrentUser = stat.player_id === currentUserId;
                        const isTopScorer = index === 0;

                        return (
                            <div
                                key={stat.player_id}
                                className={`grid grid-cols-7 gap-2 p-4 transition-colors ${isCurrentUser ? "bg-primary/10" : "hover:bg-white/5"
                                    }`}
                            >
                                <div className="col-span-2 flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                                        {stat.profiles.avatar_url ? (
                                            <Image
                                                src={stat.profiles.avatar_url}
                                                alt={stat.profiles.full_name || "Player"}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-bold">
                                                {stat.profiles.full_name?.charAt(0) || "?"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-white truncate flex items-center gap-2">
                                            {stat.profiles.full_name || "Unknown Player"}
                                            {isTopScorer && <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                                            {isCurrentUser && <span className="text-[10px] text-primary">(You)</span>}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center text-white font-bold">{stat.points}</div>
                                <div className="text-center text-zinc-400">{stat.rebounds}</div>
                                <div className="text-center text-zinc-400">{stat.assists}</div>
                                <div className="text-center text-zinc-400">{stat.steals}</div>
                                <div className="text-center text-zinc-400">{stat.blocks}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="text-[10px] text-zinc-600 uppercase tracking-wider text-center">
                PTS = Points • REB = Rebounds • AST = Assists • STL = Steals • BLK = Blocks
            </div>
        </div>
    );
}
