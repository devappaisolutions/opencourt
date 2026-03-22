"use client";

import { useState } from "react";
import { GameCard } from "./game-card";
import { Calendar, Crown, Trophy, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

interface MyGamesTabsProps {
    upcomingGames: any[];
    hostedGames: any[];
    completedGames: any[];
    userId: string;
}

type TabKey = "upcoming" | "hosted" | "completed";

export function MyGamesTabs({ upcomingGames, hostedGames, completedGames, userId }: MyGamesTabsProps) {
    const [activeTab, setActiveTab] = useState<TabKey>("upcoming");

    const tabs: { key: TabKey; label: string; count: number; icon: React.ReactNode; color: string }[] = [
        { key: "upcoming", label: "Upcoming", count: upcomingGames.length, icon: <Calendar className="w-4 h-4" />, color: "text-primary" },
        { key: "hosted", label: "Hosted", count: hostedGames.length, icon: <Crown className="w-4 h-4" />, color: "text-amber-500" },
        { key: "completed", label: "Completed", count: completedGames.length, icon: <Trophy className="w-4 h-4" />, color: "text-emerald-400" },
    ];

    return (
        <div className="space-y-6 relative z-10">
            {/* Tab Bar */}
            <div className="flex gap-2 p-1.5 bg-zinc-900/80 rounded-2xl border border-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                            activeTab === tab.key
                                ? "bg-white/10 text-white border border-white/10 shadow-lg"
                                : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                        }`}
                    >
                        <span className={activeTab === tab.key ? tab.color : ""}>{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            activeTab === tab.key ? "bg-white/10 text-white" : "bg-zinc-800 text-zinc-600"
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-300">
                {activeTab === "upcoming" && (
                    <div className="glass-card-premium p-6 md:p-8 rounded-[2.5rem] border-t border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 relative">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse-slow" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold font-heading gradient-text text-white uppercase tracking-tight">Upcoming Runs</h2>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Games you&apos;re joining</p>
                                </div>
                            </div>
                            <span className="badge-premium px-4 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-3 h-3 text-primary" />
                                {upcomingGames.length} Joined
                            </span>
                        </div>

                        {upcomingGames.length === 0 ? (
                            <div className="p-12 border border-dashed border-white/5 rounded-3xl text-center bg-zinc-950/30 relative overflow-hidden">
                                <div className="absolute inset-0 mesh-gradient opacity-20" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-8 h-8 text-zinc-600" />
                                    </div>
                                    <p className="text-zinc-500 font-medium mb-4">You haven&apos;t joined any upcoming games.</p>
                                    <Link href="/dashboard" className="text-primary font-bold text-xs uppercase tracking-widest hover:text-glow transition-all inline-flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        Browse the Dashboard
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10 space-y-12 pl-6">
                                <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent" />
                                {upcomingGames.map((game: any, idx: number) => (
                                    <div
                                        key={game.id}
                                        className="relative group opacity-0 animate-card-entrance hover-lift card-shine"
                                        style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}
                                    >
                                        <div className="absolute -left-8 top-12 w-4 h-4 rounded-full border-2 border-primary bg-black z-20 transition-all duration-300 group-hover:scale-150 group-hover:bg-primary shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                                        {idx === 0 && (
                                            <div className="absolute -top-6 left-0 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Next Up</span>
                                            </div>
                                        )}
                                        <GameCard game={game} currentUserId={userId} role="joined" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "hosted" && (
                    <div className="glass-card-premium p-6 md:p-8 rounded-[2.5rem] border-t border-white/10 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 relative">
                                    <Crown className="w-5 h-5 text-amber-500" />
                                    <div className="absolute inset-0 rounded-xl bg-amber-500/10 animate-pulse-slow" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold font-heading gradient-text text-white uppercase tracking-tight">Hosted by You</h2>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Games you&apos;re running</p>
                                </div>
                            </div>
                            <span className="badge-premium px-4 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Crown className="w-3 h-3 text-amber-500" />
                                {hostedGames.length} Created
                            </span>
                        </div>

                        {hostedGames.length === 0 ? (
                            <div className="p-12 border border-dashed border-white/5 rounded-3xl text-center bg-zinc-950/30 relative overflow-hidden">
                                <div className="absolute inset-0 mesh-gradient opacity-20" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                        <Crown className="w-8 h-8 text-zinc-600" />
                                    </div>
                                    <p className="text-zinc-500 font-medium mb-4">You aren&apos;t hosting any games.</p>
                                    <Link href="/host" className="text-amber-500 font-bold text-xs uppercase tracking-widest hover:text-glow transition-all inline-flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        Create your first run
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 relative z-10">
                                {hostedGames.map((game: any, idx: number) => (
                                    <div
                                        key={game.id}
                                        className="opacity-0 animate-card-entrance hover-lift card-shine"
                                        style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}
                                    >
                                        <GameCard game={game} currentUserId={userId} role="host" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "completed" && (
                    <div className="glass-card-premium p-6 md:p-8 rounded-[2.5rem] border-t border-white/10 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 relative">
                                    <Trophy className="w-5 h-5 text-emerald-400" />
                                    <div className="absolute inset-0 rounded-xl bg-emerald-500/10 animate-pulse-slow" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold font-heading gradient-text text-white uppercase tracking-tight">Completed Runs</h2>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Past games &amp; stats</p>
                                </div>
                            </div>
                            <span className="badge-premium px-4 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Trophy className="w-3 h-3 text-emerald-400" />
                                {completedGames.length} Played
                            </span>
                        </div>

                        {completedGames.length === 0 ? (
                            <div className="p-12 border border-dashed border-white/5 rounded-3xl text-center bg-zinc-950/30 relative overflow-hidden">
                                <div className="absolute inset-0 mesh-gradient opacity-20" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                        <Trophy className="w-8 h-8 text-zinc-600" />
                                    </div>
                                    <p className="text-zinc-500 font-medium mb-4">No completed games yet.</p>
                                    <Link href="/dashboard" className="text-emerald-400 font-bold text-xs uppercase tracking-widest hover:text-glow transition-all inline-flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        Join a game to get started
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 relative z-10">
                                {completedGames.map((game: any, idx: number) => (
                                    <div
                                        key={game.id}
                                        className="opacity-0 animate-card-entrance hover-lift card-shine"
                                        style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}
                                    >
                                        <GameCard game={game} currentUserId={userId} role="joined" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
