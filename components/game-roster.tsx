"use client";

import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Shield, User as UserIcon, XCircle, Trash2, RefreshCw, Scan, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RosterProps {
    roster: any[];
    gameId: string;
    maxPlayers: number;
    isHost: boolean;
}

export function GameRoster({ roster, gameId, maxPlayers, isHost }: RosterProps) {
    const supabase = createClient();
    const router = useRouter();
    const [updating, setUpdating] = useState<string | null>(null);
    const [currentRoster, setCurrentRoster] = useState<any[]>(roster);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Sync with props if they change (e.g. from server)
    useEffect(() => {
        setCurrentRoster(roster);
    }, [roster]);

    // Real-time Subscription
    useEffect(() => {
        const channel = supabase
            .channel(`game_roster_${gameId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'game_roster',
                filter: `game_id=eq.${gameId}`
            }, async (payload: any) => {
                // Fetch full data for the new/updated entry (to get profile info)
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const { data: newEntry } = await supabase
                        .from('game_roster')
                        .select(`
                            id,
                            status,
                            joined_at,
                            profiles:player_id (
                                username, avatar_url, position, height_ft, height_in, skill_level
                            )
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (newEntry) {
                        setCurrentRoster(prev => {
                            const exists = prev.find(p => p.id === newEntry.id);
                            if (exists) {
                                return prev.map(p => p.id === newEntry.id ? newEntry : p);
                            }
                            return [...prev, newEntry];
                        });
                    }
                } else if (payload.eventType === 'DELETE') {
                    setCurrentRoster(prev => prev.filter(p => p.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameId, supabase]);

    // QR Scanner Effect
    useEffect(() => {
        if (isScanning) {
            scannerRef.current = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scannerRef.current.render(
                (decodedText) => {
                    try {
                        const data = JSON.parse(decodedText);
                        if (data.type === 'check-in' && data.rosterId && data.gameId === gameId) {
                            handleStatusUpdate(data.rosterId, 'checked_in');
                            setIsScanning(false);
                        }
                    } catch (e) {
                        console.error("Invalid QR data", e);
                    }
                },
                (error) => {
                    // console.warn(error);
                }
            );
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.error("Scanner cleanup error", e));
                scannerRef.current = null;
            }
        };
    }, [isScanning, gameId]);

    const handleStatusUpdate = async (rosterId: string, newStatus: 'checked_in' | 'absent' | 'joined') => {
        if (!isHost) return;
        setUpdating(rosterId);

        try {
            const { error } = await supabase
                .from('game_roster')
                .update({ status: newStatus })
                .eq('id', rosterId);

            if (error) throw error;
            router.refresh();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        } finally {
            setUpdating(null);
        }
    };

    const handleKick = async (rosterId: string, username: string) => {
        if (!isHost) return;
        if (!confirm(`Are you sure you want to kick @${username} from this run?`)) return;

        setUpdating(rosterId);
        try {
            const { error } = await supabase
                .from('game_roster')
                .delete()
                .eq('id', rosterId);

            if (error) throw error;
            // Native UI refresh is handled by Realtime subscription
        } catch (error: any) {
            console.error("Error kicking player:", error);
            alert("Failed to kick player");
        } finally {
            setUpdating(null);
        }
    };

    const joinedPlayers = currentRoster.filter(p => p.status !== 'waitlist');
    const waitlistedPlayers = currentRoster.filter(p => p.status === 'waitlist');

    const PlayerCard = ({ entry }: { entry: any }) => {
        const isCheckedIn = entry.status === 'checked_in';
        const isAbsent = entry.status === 'absent';
        const isWaitlist = entry.status === 'waitlist';
        const isJoined = entry.status === 'joined';

        return (
            <div
                className={`relative glass-card p-5 rounded-[1.5rem] flex items-center gap-5 border transition-all duration-500 overflow-hidden group ${isCheckedIn ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]" :
                    isAbsent ? "border-rose-500/30 bg-rose-500/5 blur-[0.5px] grayscale opacity-60 hover:filter-none hover:opacity-100" :
                        isWaitlist ? "border-amber-500/20 bg-amber-500/5" :
                            "border-white/5 hover:border-white/10 hover:shadow-2xl"
                    }`}

            >
                <div className="glare-effect" />

                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 shrink-0 relative overflow-hidden shadow-inner">
                    {entry.profiles?.avatar_url ? (
                        <Image
                            src={entry.profiles.avatar_url}
                            alt={`${entry.profiles?.username || 'Player'} avatar`}
                            width={64}
                            height={64}
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="64px"
                        />
                    ) : (
                        <UserIcon className="w-7 h-7 text-zinc-600" />
                    )}

                    {/* Status Indicator Badge */}
                    {isCheckedIn && (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-lg p-1 border-2 border-black shadow-lg">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    )}
                    {isAbsent && (
                        <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-lg p-1 border-2 border-black shadow-lg">
                            <XCircle className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 z-10">
                    <div className="flex items-center justify-between">
                        <p className={`font-black text-xl tracking-tight truncate ${isAbsent ? "text-zinc-600 line-through" : "text-white"}`}>
                            @{entry.profiles?.username || 'Baller'}
                        </p>

                        {/* Action Buttons for Host */}
                        {isHost && (
                            <div className="flex gap-2 ml-2">
                                {isJoined && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(entry.id, 'checked_in')}
                                            disabled={!!updating}
                                            className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 transition-all hover:scale-110 active:scale-90"
                                            title="Mark Present (+Score)"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(entry.id, 'absent')}
                                            disabled={!!updating}
                                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-all hover:scale-110 active:scale-90"
                                            title="Mark Absent (-Score)"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleKick(entry.id, entry.profiles?.username)}
                                            disabled={!!updating}
                                            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-rose-500 hover:text-white text-zinc-600 border border-white/5 transition-all hover:scale-110 active:scale-90"
                                            title="Kick from Squad"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                                {isWaitlist && (
                                    <div className="flex gap-2">
                                        {joinedPlayers.length < maxPlayers && (
                                            <button
                                                onClick={() => handleStatusUpdate(entry.id, 'joined')}
                                                disabled={!!updating}
                                                className="px-3 py-1 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-all text-[10px] font-black tracking-widest uppercase"
                                            >
                                                SQUAD UP
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleKick(entry.id, entry.profiles?.username)}
                                            disabled={!!updating}
                                            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-rose-500 hover:text-white text-zinc-600 border border-white/5 transition-all hover:scale-110 active:scale-90"
                                            title="Remove from Waitlist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {(isCheckedIn || isAbsent) && (
                                    <button
                                        onClick={() => handleStatusUpdate(entry.id, 'joined')}
                                        disabled={!!updating}
                                        className="text-[10px] text-zinc-600 hover:text-white uppercase font-black tracking-widest transition-colors"
                                    >
                                        RESET
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1 items-center">
                        <span className="flex items-center gap-1">
                            {entry.profiles?.position || 'N/A'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className={`${entry.profiles?.skill_level === 'Elite' ? 'text-amber-500/80' :
                            entry.profiles?.skill_level === 'Competitive' ? 'text-primary/80' :
                                'text-zinc-500'
                            }`}>
                            {entry.profiles?.skill_level || 'Rookie'}
                        </span>

                        {isWaitlist && (
                            <span className="ml-auto px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                                WAITLIST
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10">
            {/* Squad Roster */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-white">Squad Roster</h2>
                        <p className="text-zinc-500 text-sm">Players confirmed for this run</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isHost && (
                            <button
                                onClick={() => setIsScanning(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                            >
                                <Scan className="w-4 h-4" /> SCAN MODE
                            </button>
                        )}
                        <span className="px-4 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 text-sm font-bold">
                            {joinedPlayers.length} / {maxPlayers} Players
                        </span>
                    </div>
                </div>

                {/* Scanner Modal */}
                {isScanning && (
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="w-full max-w-sm glass-card rounded-[3rem] overflow-hidden border-t border-white/20 shadow-4xl animate-in zoom-in-95 duration-300">
                            <div className="p-8 space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-white tracking-tight uppercase italic">Scanner Active</h3>
                                    <button
                                        onClick={() => setIsScanning(false)}
                                        className="p-2 rounded-full hover:bg-white/10 text-zinc-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div id="qr-reader" className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner" />

                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">
                                    Point the camera at a player's QR pass
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {joinedPlayers.map((entry: any) => (
                        <PlayerCard key={entry.id} entry={entry} />
                    ))}

                    {/* Empty Slots */}
                    {Array.from({ length: Math.max(0, maxPlayers - joinedPlayers.length) }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-4 rounded-xl border border-dashed border-white/5 flex items-center gap-4 opacity-50">
                            <div className="w-14 h-14 rounded-full bg-zinc-900/50 flex items-center justify-center border border-dashed border-white/10">
                                <UserIcon className="w-6 h-6 text-zinc-700" />
                            </div>
                            <p className="text-zinc-600 font-medium">Open Slot</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Waitlist Section */}
            {waitlistedPlayers.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-zinc-400">Waitlist</h2>
                        <p className="text-zinc-600 text-sm">Next in line if someone leaves</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {waitlistedPlayers.map((entry: any) => (
                            <PlayerCard key={entry.id} entry={entry} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

