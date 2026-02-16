"use client";

import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, Calendar, CheckCircle2, Clock, Crown, MapPin, User, Users } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface GameProps {
    id: string;
    title: string;
    location: string;
    time: string;
    date: string;
    format: string;
    level: string;
    cost: string;
    image: string;
    players: number;
    max_players: number;
    host_id: string;
    status?: string;
    cancellation_reason?: string;
    isHostPlaying?: boolean;
}

export function GameCard({
    game,
    currentUserId,
    role
}: {
    game: GameProps;
    currentUserId?: string;
    role?: 'host' | 'joined'
}) {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [joined, setJoined] = useState(game.isHostPlaying || false);
    const [mounted, setMounted] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const isCancelled = game.status === 'cancelled';
    const isCompleted = game.status === 'completed';


    useEffect(() => {
        setMounted(true);
    }, []);

    const handleJoin = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUserId) {
            router.push("/login");
            return;
        }
        setLoading(true);

        const { error } = await supabase.from("game_roster").insert({
            game_id: game.id,
            player_id: currentUserId,
            status: "joined",
        });

        if (error) {
            if (error.code === "23505") {
                setJoined(true);
                router.refresh();
            } else {
                console.error("Error joining game:", error);
                alert("Failed to join.");
            }
        } else {
            setJoined(true);
            router.refresh();
        }
        setLoading(false);
    };

    const fillPercentage = (game.players / game.max_players) * 100;

    return (
        <div
            ref={cardRef}
            onMouseLeave={() => setIsHovered(false)}
            onMouseEnter={() => setIsHovered(true)}
            className={`group relative block h-full overflow-hidden rounded-2xl border p-1 transition-all duration-300 hover-lift card-shine ${isCancelled
                ? 'border-red-500/30 bg-[#2A2827]/60 opacity-70'
                : isCompleted
                    ? 'border-emerald-500/30 bg-[#2A2827]'
                    : 'border-white/8 bg-[#2A2827] hover:border-primary/40'
                }`}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-400 ${game.image}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1D] via-[#1F1D1D]/80 to-transparent" />

            {/* Glare */}
            <div className="glare-effect" />

            {/* Link Overlay */}
            <NextLink href={`/game/${game.id}`} className="absolute inset-0 z-10" aria-label={`View ${game.title}`} />

            <div className="relative h-full flex flex-col justify-between p-6 z-20 pointer-events-none">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 relative">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase badge-premium text-[#B8B0A6]">
                            {game.format}
                        </span>

                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${game.level === 'Elite' ? 'bg-primary/10 text-primary border-primary/30' :
                            game.level === 'Competitive' ? 'bg-[#FF9800]/10 text-[#FF9800] border-[#FF9800]/30' :
                                'bg-[#F5EFEA]/10 text-[#F5EFEA] border-[#F5EFEA]/30'
                            }`}>
                            {game.level}
                        </span>

                        {/* Cancelled badge - inline on mobile */}
                        {isCancelled && (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-red-500/20 text-red-400 border border-red-500/30 md:hidden">
                                <AlertTriangle className="w-3 h-3" />
                                CANCELLED
                            </span>
                        )}
                        {isCompleted && (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 md:hidden">
                                <CheckCircle2 className="w-3 h-3" />
                                COMPLETED
                            </span>
                        )}
                    </div>

                    {/* Cancellation reason on mobile - below badges */}
                    {isCancelled && game.cancellation_reason && (
                        <span className="md:hidden px-2 py-1 rounded-lg bg-[#1F1D1D]/80 text-[9px] text-red-300/70 italic">
                            "{game.cancellation_reason}"
                        </span>
                    )}

                    {/* Right side desktop only: Role badge OR Cancelled/Completed status */}
                    {isCancelled ? (
                        <div className="hidden md:flex flex-col items-end gap-1 absolute top-0 right-0">
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                                <AlertTriangle className="w-3 h-3" />
                                CANCELLED
                            </span>
                            {game.cancellation_reason && (
                                <span className="max-w-[180px] px-2 py-1 rounded-lg bg-[#1F1D1D]/80 text-[9px] text-red-300/70 italic text-right truncate">
                                    "{game.cancellation_reason}"
                                </span>
                            )}
                        </div>
                    ) : isCompleted ? (
                        <span className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            COMPLETED
                        </span>
                    ) : role && (
                        <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tight ${role === 'host'
                            ? "bg-primary text-white border-primary"
                            : "bg-[#F5EFEA] text-[#1F1D1D] border-[#E8E0D8]"
                            }`}>
                            {role === 'host' ? <Crown className="w-3 h-3 fill-current" /> : <User className="w-3 h-3" />}
                            {role}
                        </div>
                    )}
                </div>

                <div className="space-y-5 mt-auto">
                    <div className="space-y-2">
                        <h3 className="text-xl font-heading font-bold text-[#F5EFEA] leading-tight tracking-tight group-hover:text-primary transition-colors">
                            {game.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[#B8B0A6] text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-medium">{game.location}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-5 border-b border-white/5">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-[#B8B0A6]/60 uppercase tracking-widest">Schedule</p>
                            <div className="flex items-center gap-2 text-[#F5EFEA] text-sm font-medium">
                                <Calendar className="w-3.5 h-3.5 text-[#B8B0A6]" />
                                {mounted ? game.date : "--/--/----"}
                            </div>
                            <div className="flex items-center gap-2 text-[#F5EFEA] text-sm font-medium">
                                <Clock className="w-3.5 h-3.5 text-[#B8B0A6]" />
                                {mounted ? game.time : "--:--"}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-[#B8B0A6]/60 uppercase tracking-widest">Roster</p>
                            <div className="flex items-center gap-2 text-[#F5EFEA] text-sm font-medium">
                                <Users className="w-3.5 h-3.5 text-[#B8B0A6]" />
                                <span className={game.players >= game.max_players ? 'text-primary' : ''}>
                                    {game.players}/{game.max_players}
                                </span>
                            </div>
                            {/* Fill Bar */}
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                                <div
                                    className={`h-full rounded-full transition-all duration-400 ${fillPercentage >= 100 ? 'bg-gradient-to-r from-primary to-[#E8A966]' :
                                        fillPercentage >= 70 ? 'bg-gradient-to-r from-[#FF9800] to-primary' :
                                            'bg-gradient-to-r from-[#F5EFEA]/60 to-[#F5EFEA]'
                                        }`}
                                    style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#B8B0A6]/60 uppercase tracking-widest mb-0.5">Entry</span>
                            <span className={`text-lg font-bold tracking-tight ${game.cost === 'Free' ? 'text-[#F5EFEA]' : 'text-[#F5EFEA]'}`}>
                                {game.cost === 'Free' ? 'FREE' : game.cost}
                            </span>
                        </div>

                        {/* Show appropriate status based on role */}
                        {!isCancelled && !isCompleted && (
                            (role === 'joined' || joined) ? (
                                <div className="px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase bg-primary/15 text-primary border border-primary/30">
                                    {role === 'host' ? 'PLAYING' : 'CONFIRMED'}
                                </div>
                            ) : (
                                <button
                                    onClick={handleJoin}
                                    disabled={loading || game.players >= game.max_players}
                                    className="px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all pointer-events-auto bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 shimmer-btn"
                                >
                                    {loading ? "..." : role === 'host' ? "JOIN AS PLAYER" : "JOIN RUN"}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
