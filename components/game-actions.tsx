"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut, Plus, ShieldCheck, X, ScrollText, CheckCircle2, QrCode, AlertTriangle, Trophy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReviewModal } from "./review-modal";

interface GameActionsProps {
    gameId: string;
    userId: string;
    isHost: boolean;
    isJoined: boolean;
    currentPlayers: number;
    maxPlayers: number;
    disabled?: boolean;
    houseRules?: string;
    rosterId?: string;
    status?: string;
}

export function GameActions({ gameId, userId, isHost, isJoined, currentPlayers, maxPlayers, disabled, houseRules, rosterId, status }: GameActionsProps) {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const isFull = currentPlayers >= maxPlayers;

    const handleJoin = async () => {
        if (!userId) return;

        // If there are house rules and user hasn't agreed yet
        if (houseRules && !showRulesModal) {
            setShowRulesModal(true);
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from("game_roster").insert({
                game_id: gameId,
                player_id: userId,
                status: isFull ? "waitlist" : "joined",
            });
            if (error) throw error;
            setShowRulesModal(false);
            router.refresh();
        } catch (error: any) {
            console.error("Error joining game:", error);
            if (error.code !== "23505") { // Ignore unique violation
                alert("Could not join game.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!confirm("Are you sure you want to leave this run?")) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from("game_roster")
                .delete()
                .eq("game_id", gameId)
                .eq("player_id", userId);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error("Error leaving game:", error);
            alert("Could not leave game.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        // Prompt for cancellation reason
        const reason = prompt("Please provide a reason for cancelling this run (this will be visible to players):");

        if (reason === null) return; // User clicked Cancel on prompt
        if (!reason.trim()) {
            alert("Please provide a reason for cancellation.");
            return;
        }

        if (!confirm(`Are you sure you want to CANCEL this run?\n\nReason: "${reason}"\n\nThis cannot be undone and all players will be notified.`)) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("games")
                .update({
                    status: "cancelled",
                    cancellation_reason: reason.trim()
                })
                .eq("id", gameId)
                .select();

            console.log("Cancel result:", { data, error });

            if (error) {
                console.error("Error cancelling game:", JSON.stringify(error, null, 2));
                alert(`Could not cancel game: ${error.message || error.details || 'Unknown error'}`);
                return;
            }

            if (!data || data.length === 0) {
                alert("Could not cancel game. You may not have permission to cancel this run.");
                return;
            }

            alert("Run cancelled successfully!");
            router.refresh();
            router.push("/my-games");
        } catch (error: any) {
            console.error("Error cancelling game:", error);
            alert(`Could not cancel game: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!confirm("Are you sure you want to mark this run as COMPLETED?")) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from("games")
                .update({ status: "completed" })
                .eq("id", gameId);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error("Error completing game:", error);
            alert("Could not complete game.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "cancelled") {
        return (
            <div className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold text-xs tracking-[0.2em] uppercase italic">
                <AlertTriangle className="w-5 h-5" />
                RUN CANCELLED
            </div>
        );
    }

    if (status === "completed") {
        return (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs tracking-[0.2em] uppercase italic">
                    <CheckCircle2 className="w-5 h-5" />
                    RUN COMPLETED
                </div>
                {isJoined && (
                    <button
                        onClick={() => setShowReviewModal(true)}
                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        <Trophy className="w-4 h-4" /> REVIEW SQUAD
                    </button>
                )}
            </div>
        );
    }

    if (isHost) {
        return (
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-500 font-bold text-xs tracking-[0.2em] uppercase italic">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    HOST MODE ACTIVE
                </div>
                <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all active:scale-95 disabled:opacity-50"
                >
                    <CheckCircle2 className="w-4 h-4" /> COMPLETE RUN
                </button>
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-[10px] tracking-widest uppercase bg-zinc-950 border border-white/5 text-zinc-500 hover:text-rose-500 hover:border-rose-500/20 transition-all active:scale-95 disabled:opacity-50 italic"
                >
                    {loading ? "CANCELING..." : (
                        <>
                            <X className="w-4 h-4" /> CANCEL RUN
                        </>
                    )}
                </button>
            </div>
        );
    }

    if (isJoined) {
        return (
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-all active:scale-95"
                >
                    <QrCode className="w-4 h-4" /> SHOW CHECK-IN QR
                </button>
                <button
                    onClick={handleLeave}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-[10px] tracking-widest uppercase bg-zinc-950 border border-white/5 text-zinc-500 hover:text-rose-500 hover:border-rose-500/20 transition-all active:scale-95 disabled:opacity-50 italic"
                >
                    {loading ? "LEAVING..." : (
                        <>
                            <LogOut className="w-5 h-5" /> LEAVE SQUAD
                        </>
                    )}
                </button>

                {/* QR Code Modal */}
                {showQRModal && (
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="w-full max-w-sm glass-card rounded-[3rem] overflow-hidden border-t border-white/20 shadow-4xl animate-in zoom-in-95 duration-300">
                            <div className="p-8 text-center space-y-8">
                                <div className="flex justify-between items-center bg-white/5 -mx-8 -mt-8 p-6 px-8 border-b border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-left">Player Pass</p>
                                    <button
                                        onClick={() => setShowQRModal(false)}
                                        className="p-1.5 rounded-full hover:bg-white/10 text-zinc-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-white tracking-tight uppercase italic underline decoration-primary decoration-4">Check-in Required</h2>
                                    <p className="text-zinc-500 text-sm font-medium">Show this to the host when you arrive at the court.</p>
                                </div>

                                <div className="bg-white p-6 rounded-[2rem] inline-block shadow-[0_0_50px_rgba(168,85,247,0.3)]">
                                    <QRCodeSVG
                                        value={JSON.stringify({ type: 'check-in', rosterId, gameId })}
                                        size={200}
                                        level="H"
                                        includeMargin={false}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setShowQRModal(false)}
                                        className="w-full py-4 rounded-2xl bg-zinc-900 text-zinc-400 font-black text-[10px] tracking-widest uppercase hover:text-white transition-colors"
                                    >
                                        CLOSE PASS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <button
                onClick={handleJoin}
                disabled={loading || disabled || (!userId && !loading)}
                className={`flex items-center gap-2 px-10 py-5 rounded-[2rem] font-bold text-xs tracking-[0.2em] uppercase transition-all duration-500 active:scale-95 disabled:opacity-50 italic ${isFull
                    ? "bg-zinc-900 text-amber-500 border border-amber-500/20"
                    : "bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary/90"
                    }`}
            >
                {loading ? "PROCESSING..." : (
                    <>
                        <Plus className="w-5 h-5" />
                        {isFull ? "JOIN THE WAITLIST" : "JOIN THE RUN"}
                    </>
                )}
            </button>

            {/* House Rules Agreement Modal */}
            {showRulesModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg glass-card rounded-[2.5rem] overflow-hidden border-t border-white/20 shadow-4xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-primary">
                                        <ScrollText className="w-5 h-5" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Agreement Required</p>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white tracking-tight italic uppercase">House Rules</h2>
                                </div>
                                <button
                                    onClick={() => setShowRulesModal(false)}
                                    className="p-2 rounded-full hover:bg-white/5 text-zinc-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-zinc-950/50 rounded-2xl p-6 border border-white/5 max-h-[300px] overflow-y-auto no-scrollbar">
                                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap italic">
                                    {houseRules}
                                </p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <button
                                    onClick={handleJoin}
                                    disabled={loading}
                                    className="w-full bg-primary text-white font-bold py-5 rounded-[2rem] hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 uppercase tracking-[0.2em] text-xs italic"
                                >
                                    {loading ? "PROCESSING..." : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" /> I AGREE & JOIN THE RUN
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                                    By joining, you agree to respect the host and follow the court rules.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ReviewModal
                gameId={gameId}
                userId={userId}
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
            />
        </>
    );
}


