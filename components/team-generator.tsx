"use client";

import { useState } from "react";
import { Users, Loader2, RefreshCw } from "lucide-react";
import { TeamDisplay } from "./team-display";

interface TeamGeneratorProps {
    gameId: string;
    isHost: boolean;
    gameStatus: string;
    teamsGenerated: boolean;
    existingTeams?: any[];
}

export function TeamGenerator({
    gameId,
    isHost,
    gameStatus,
    teamsGenerated,
    existingTeams
}: TeamGeneratorProps) {
    const [teams, setTeams] = useState(existingTeams || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // Only show for host and after game has started
    if (!isHost || gameStatus === 'upcoming') {
        return null;
    }

    const handleGenerateTeams = async () => {
        setLoading(true);
        setError(null);
        setShowConfirm(false);

        try {
            const response = await fetch(`/api/games/${gameId}/generate-teams`, {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate teams');
            }

            setTeams(data.teams);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateClick = () => {
        if (teamsGenerated || teams) {
            setShowConfirm(true);
        } else {
            handleGenerateTeams();
        }
    };

    return (
        <div className="space-y-6">
            {/* Generate/Regenerate Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                        Team Matchups
                    </h2>
                </div>

                <button
                    onClick={handleRegenerateClick}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-primary/50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                        </>
                    ) : teams || teamsGenerated ? (
                        <>
                            <RefreshCw className="w-4 h-4" />
                            Regenerate Teams
                        </>
                    ) : (
                        <>
                            <Users className="w-4 h-4" />
                            Generate Teams
                        </>
                    )}
                </button>
            </div>

            {/* Confirmation Dialog */}
            {showConfirm && (
                <div className="glass-card-premium p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <RefreshCw className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="font-bold text-white mb-1">Regenerate Teams?</h3>
                                <p className="text-sm text-zinc-400">
                                    This will create new team assignments. Players will be redistributed based on their stats, position, and skill level.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleGenerateTeams}
                                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black font-bold text-sm transition-all"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="glass-card-premium p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {/* Team Display */}
            {teams && teams.length > 0 && (
                <TeamDisplay teams={teams} />
            )}
        </div>
    );
}
