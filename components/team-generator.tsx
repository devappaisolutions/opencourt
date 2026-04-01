"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, Loader2, RefreshCw, Zap, Save, Eye, EyeOff, CheckCircle, Clock } from "lucide-react";
import { TeamDisplay } from "./team-display";
import { TeamDndBoard, type DraggablePlayer, type LocalTeamState } from "./team-dnd-board";

export interface TeamGeneratorProps {
    gameId: string;
    isHost: boolean;
    isJoined: boolean;
    gameStatus: string;
    teamsGenerated: boolean;
    teamsPublished: boolean;
    confirmedRoster: DraggablePlayer[];
    existingTeams?: any[] | null;
}

function initTeamState(confirmedRoster: DraggablePlayer[], existingTeams?: any[] | null): LocalTeamState {
    if (existingTeams && existingTeams.length > 0) {
        const t1 = existingTeams.find((t: any) => t.team_number === 1)?.players ?? [];
        const t2 = existingTeams.find((t: any) => t.team_number === 2)?.players ?? [];
        const assignedIds = new Set([...t1, ...t2].map((p: any) => p.id));
        const pool = confirmedRoster.filter(p => !assignedIds.has(p.id));
        // Ensure existing team players have ovr from confirmedRoster
        const withOVR = (players: any[]) => players.map((p: any) => {
            const found = confirmedRoster.find(r => r.id === p.id);
            return found ?? { ...p, ovr: p.ovr ?? 0 };
        });
        return { pool, team1: withOVR(t1), team2: withOVR(t2) };
    }
    return { pool: confirmedRoster, team1: [], team2: [] };
}

export function TeamGenerator({
    gameId,
    isHost,
    isJoined,
    gameStatus,
    teamsGenerated,
    teamsPublished,
    confirmedRoster,
    existingTeams,
}: TeamGeneratorProps) {
    const router = useRouter();
    const [teamState, setTeamState] = useState<LocalTeamState>(() => initTeamState(confirmedRoster, existingTeams));
    const [isDirty, setIsDirty] = useState(false);
    const [localPublished, setLocalPublished] = useState(teamsPublished);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const hasLineup = teamState.team1.length > 0 || teamState.team2.length > 0;
    const confirmedCount = confirmedRoster.length;

    const handleMove = useCallback((playerId: string, destination: 'pool' | 'team1' | 'team2') => {
        setTeamState(prev => {
            const all = [...prev.pool, ...prev.team1, ...prev.team2];
            const player = all.find(p => p.id === playerId);
            if (!player) return prev;
            return {
                pool: destination === 'pool' ? [...prev.pool.filter(p => p.id !== playerId), player] : prev.pool.filter(p => p.id !== playerId),
                team1: destination === 'team1' ? [...prev.team1.filter(p => p.id !== playerId), player] : prev.team1.filter(p => p.id !== playerId),
                team2: destination === 'team2' ? [...prev.team2.filter(p => p.id !== playerId), player] : prev.team2.filter(p => p.id !== playerId),
            };
        });
        setIsDirty(true);
        setSaveSuccess(false);
        setLocalPublished(false);
    }, []);

    const handleAutoGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        setShowRegenerateConfirm(false);
        try {
            const res = await fetch(`/api/games/${gameId}/generate-teams`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate teams');
            // Rebuild local state from returned teams
            const t1 = (data.teams?.find((t: any) => t.team_number === 1)?.players ?? []).map((p: any) => {
                const found = confirmedRoster.find(r => r.id === p.id);
                return found ?? { ...p, ovr: p.ovr ?? 0 };
            });
            const t2 = (data.teams?.find((t: any) => t.team_number === 2)?.players ?? []).map((p: any) => {
                const found = confirmedRoster.find(r => r.id === p.id);
                return found ?? { ...p, ovr: p.ovr ?? 0 };
            });
            const assignedIds = new Set([...t1, ...t2].map((p: any) => p.id));
            setTeamState({ pool: confirmedRoster.filter(p => !assignedIds.has(p.id)), team1: t1, team2: t2 });
            setIsDirty(false);
            setSaveSuccess(true);
            setLocalPublished(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (teamState.team1.length === 0 && teamState.team2.length === 0) {
            setError('Assign at least one player to a team before saving.');
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            const assignments = [
                ...teamState.team1.map(p => ({ playerId: p.id, teamNumber: 1 as const })),
                ...teamState.team2.map(p => ({ playerId: p.id, teamNumber: 2 as const })),
            ];
            const res = await fetch(`/api/games/${gameId}/save-teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignments }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save lineup');
            setIsDirty(false);
            setSaveSuccess(true);
            setLocalPublished(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async (publish: boolean) => {
        setIsPublishing(true);
        setError(null);
        try {
            const res = await fetch(`/api/games/${gameId}/publish-teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publish }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update publish state');
            setLocalPublished(publish);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPublishing(false);
        }
    };

    // --- PLAYER VIEW ---
    if (!isHost) {
        if (!isJoined) return null;
        if (!localPublished) {
            return (
                <div className="bg-[#2A2827] rounded-2xl border border-white/10 p-5 text-center space-y-2">
                    <Clock className="w-6 h-6 text-zinc-600 mx-auto" />
                    <p className="text-sm text-zinc-400 font-bold">Team lineup is being prepared</p>
                    <p className="text-xs text-zinc-600">Check back soon</p>
                </div>
            );
        }
        return existingTeams && existingTeams.length > 0
            ? <TeamDisplay teams={existingTeams} />
            : null;
    }

    // --- HOST VIEW ---
    if (gameStatus === 'upcoming') return null;

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider font-heading">
                        Team Matchups
                    </h2>
                </div>
                {localPublished && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle className="w-3 h-3" /> Published
                    </span>
                )}
            </div>

            {/* Unsaved changes banner */}
            {isDirty && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-xs text-amber-400 font-bold">Unsaved changes</p>
                </div>
            )}

            {/* Published banner */}
            {localPublished && !isDirty && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <p className="text-xs text-emerald-400 font-bold">Players can see this lineup</p>
                </div>
            )}

            {/* Not enough players warning */}
            {confirmedCount < 4 && (
                <div className="p-4 rounded-xl bg-white/3 border border-white/8">
                    <p className="text-sm text-zinc-400">
                        Need at least 4 confirmed players to generate teams ({confirmedCount}/4 confirmed)
                    </p>
                </div>
            )}

            {/* Drag Board */}
            <div className="space-y-3">
                <TeamDndBoard teamState={teamState} onMove={handleMove} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                {/* Auto-generate */}
                <button
                    onClick={() => hasLineup ? setShowRegenerateConfirm(true) : handleAutoGenerate()}
                    disabled={isGenerating || confirmedCount < 4}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 hover:bg-white/12 text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
                >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {isGenerating ? 'Generating…' : hasLineup ? 'Auto-Generate' : 'Generate Teams'}
                </button>

                {/* Save lineup */}
                <button
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess && !isDirty ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Saving…' : saveSuccess && !isDirty ? 'Saved' : 'Save Lineup'}
                </button>

                {/* Publish / Unpublish */}
                {(teamsGenerated || saveSuccess) && !isDirty && (
                    localPublished ? (
                        <button
                            onClick={() => handlePublish(false)}
                            disabled={isPublishing}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
                        >
                            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <EyeOff className="w-4 h-4" />}
                            Unpublish
                        </button>
                    ) : (
                        <button
                            onClick={() => handlePublish(true)}
                            disabled={isPublishing}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                            Publish Matchup
                        </button>
                    )
                )}
            </div>

            {/* Regenerate confirmation dialog */}
            {showRegenerateConfirm && (
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                            <RefreshCw className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm mb-1">Overwrite current lineup?</h3>
                            <p className="text-xs text-zinc-400">
                                Auto-generate will replace the current arrangement. Players will be redistributed based on stats and skill level.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAutoGenerate} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-colors">
                            Confirm
                        </button>
                        <button onClick={() => setShowRegenerateConfirm(false)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/5">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}
        </div>
    );
}
