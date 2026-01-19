"use client";

import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Star, Trophy, X, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ReviewModalProps {
    gameId: string;
    userId: string;
    isOpen: boolean;
    onClose: () => void;
}

const TAGS = ["Elite Finisher", "Lockdown Defense", "Pure Shooter", "Glue Guy", "Reliable", "High IQ"];

export function ReviewModal({ gameId, userId, isOpen, onClose }: ReviewModalProps) {
    const supabase = createClient();
    const [players, setPlayers] = useState<any[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [rating, setRating] = useState(5);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSquad();
        }
    }, [isOpen]);

    const fetchSquad = async () => {
        const { data } = await supabase
            .from('game_roster')
            .select(`
                player_id,
                profiles:player_id (username, avatar_url)
            `)
            .eq('game_id', gameId)
            .neq('player_id', userId)
            .eq('status', 'checked_in'); // Only review those who showed up

        if (data) setPlayers(data);
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        if (!selectedPlayer) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('game_reviews').insert({
                game_id: gameId,
                reviewer_id: userId,
                reviewee_id: selectedPlayer,
                rating,
                categories: selectedTags,
                comment
            });
            if (error) throw error;
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setSelectedPlayer(null);
                setRating(5);
                setSelectedTags([]);
                setComment("");
            }, 2000);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Could not submit review.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[102] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg glass-card rounded-[3rem] overflow-hidden border-t border-white/20 shadow-4xl animate-in zoom-in-95 duration-300">
                <div className="p-8 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-primary">
                                <Trophy className="w-5 h-5" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Post-Run Review</p>
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight italic uppercase">Rate the Squad</h2>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {!selectedPlayer ? (
                        <div className="space-y-4">
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Select a player to review:</p>
                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pt-1">
                                {players.map((p) => (
                                    <button
                                        key={p.player_id}
                                        onClick={() => setSelectedPlayer(p.player_id)}
                                        className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-primary/50 transition-all text-left"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                                            {p.profiles?.avatar_url ? (
                                                <Image src={p.profiles.avatar_url} alt="Profile" width={40} height={40} className="object-cover" />
                                            ) : (
                                                <UserIcon className="w-full h-full p-2 text-zinc-600" />
                                            )}
                                        </div>
                                        <p className="font-bold text-sm text-white truncate">@{p.profiles?.username}</p>
                                    </button>
                                ))}
                                {players.length === 0 && (
                                    <p className="col-span-2 text-center py-8 text-zinc-600 italic">No players available to review.</p>
                                )}
                            </div>
                        </div>
                    ) : submitted ? (
                        <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white uppercase italic">Respect Earned!</h3>
                                <p className="text-zinc-500 text-sm">Review submitted successfully.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-2xl border border-primary/20">
                                <button onClick={() => setSelectedPlayer(null)} className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                                <p className="text-zinc-400 text-sm">Reviewing <span className="text-white font-bold italic">@{players.find(p => p.player_id === selectedPlayer)?.profiles?.username}</span></p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-widest text-center">Score their Run</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setRating(s)}
                                            className={`p-2 transition-all ${rating >= s ? 'text-amber-500' : 'text-zinc-800 hover:text-zinc-700'}`}
                                        >
                                            <Star className={`w-10 h-10 ${rating >= s ? 'fill-current' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black italic text-zinc-500 uppercase tracking-widest">Player Traits</p>
                                <div className="flex flex-wrap gap-2">
                                    {TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${selectedTags.includes(tag) ? 'bg-primary text-white border-primary' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-white'}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                placeholder="Add a comment... (optional)"
                                className="w-full h-24 bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-700 resize-none"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-5 rounded-[2rem] bg-primary text-white font-black text-xs tracking-[0.2em] uppercase italic shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
