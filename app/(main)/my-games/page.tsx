import { createClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/game-card";
import { Calendar, Crown, PlusCircle, Sparkles, Zap } from "lucide-react";
import { redirect } from "next/navigation";
import NextLink from "next/link";

export default async function MyGamesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Hosted Games with error handling
    let hostedGames: any[] = [];
    try {
        const { data } = await supabase
            .from('games')
            .select('*')
            .eq('host_id', user.id)
            .order('date_time', { ascending: true });
        hostedGames = data || [];
    } catch (error) {
        console.warn('Could not fetch hosted games:', error);
    }

    // Check which hosted games the host has also joined as player
    const hostedGameIds = hostedGames.map(g => g.id);
    let hostRosterEntries: any[] = [];
    try {
        const { data } = await supabase
            .from('game_roster')
            .select('game_id')
            .eq('player_id', user.id)
            .in('game_id', hostedGameIds.length > 0 ? hostedGameIds : ['_none_']);
        hostRosterEntries = data || [];
    } catch (error) {
        console.warn('Could not fetch host roster entries:', error);
    }

    const hostJoinedGameIds = new Set(hostRosterEntries.map(e => e.game_id));

    // Fetch Joined Games (all games user has joined as player, including own hosted games)
    let joinedData: any[] = [];
    try {
        const { data } = await supabase
            .from('game_roster')
            .select(`
                game:games (*)
            `)
            .eq('player_id', user.id)
            .eq('status', 'joined');
        joinedData = data || [];
    } catch (error) {
        console.warn('Could not fetch joined games:', error);
    }

    // Flatten joined data - include all games user has joined as player
    interface JoinedGameData {
        game: any;
    }
    const joinedGames = joinedData?.map((item: JoinedGameData) => item.game) || [];

    // Sort joined games by date (client-side sort since we fetched via relation)
    joinedGames.sort((a: any, b: any) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

    // Helper to process game for display
    const processGame = (g: any, isHostPlaying?: boolean) => ({
        ...g,
        image: g.image_gradient || "bg-gradient-to-br from-[#2A2827] to-[#1F1D1D]",
        players: g.current_players || 0,
        max_players: g.max_players || 10,
        level: g.skill_level,
        status: g.status || 'open',
        cancellation_reason: g.cancellation_reason || null,
        isHostPlaying: isHostPlaying || false,
        time: new Date(g.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date(g.date_time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    });

    const displayHosted = (hostedGames || []).map(g => processGame(g, hostJoinedGameIds.has(g.id)));
    const displayJoined = joinedGames.map((g: any) => processGame(g));

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="orb orb-primary w-[500px] h-[500px] top-0 -right-40 opacity-20" style={{ animationDelay: '-3s' }} />
                <div className="orb orb-secondary w-[400px] h-[400px] bottom-20 -left-40 opacity-15" style={{ animationDelay: '-8s' }} />
            </div>

            {/* Split Header consistent with Profile */}
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-primary animate-bounce-subtle" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Your Court Time</span>
                    </div>
                    <h1 className="text-3xl font-bold font-heading gradient-text text-white uppercase italic tracking-tight">Your <span className="gradient-text-animated">Schedule</span></h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Manage your player itinerary and tracks.</p>
                </div>
                <NextLink
                    href="/host"
                    className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/30 shimmer-btn btn-glow"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">Host Run</span>
                </NextLink>
            </div>

            {/* Upcoming (Joined) - Wrapped in Glass Card like Profile Sections */}
            <div className="glass-card-premium p-6 md:p-8 rounded-[2.5rem] border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 relative">
                            <Calendar className="w-5 h-5 text-primary" />
                            {/* Pulse Effect */}
                            <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse-slow" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-heading gradient-text text-white uppercase tracking-tight">Upcoming Runs</h2>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Games you're joining</p>
                        </div>
                    </div>
                    <span className="badge-premium px-4 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3 text-primary" />
                        {displayJoined.length} Joined
                    </span>
                </div>

                {displayJoined.length === 0 ? (
                    <div className="p-12 border border-dashed border-white/5 rounded-3xl text-center bg-zinc-950/30 relative overflow-hidden">
                        <div className="absolute inset-0 mesh-gradient opacity-20" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 font-medium mb-4">You haven't joined any games yet.</p>
                            <NextLink href="/dashboard" className="text-primary font-bold text-xs uppercase tracking-widest hover:text-glow transition-all inline-flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                Browse the Dashboard
                            </NextLink>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 space-y-12 pl-6">
                        {/* Timeline Path */}
                        <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent" />

                        {displayJoined.map((game: any, idx: number) => (
                            <div
                                key={game.id}
                                className="relative group opacity-0 animate-card-entrance hover-lift card-shine"
                                style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}
                            >
                                {/* Timeline Node */}
                                <div className="absolute -left-8 top-12 w-4 h-4 rounded-full border-2 border-primary bg-black z-20 transition-all duration-300 group-hover:scale-150 group-hover:bg-primary shadow-[0_0_15px_rgba(168,85,247,0.5)]" />

                                {/* Next Up Badge */}
                                {idx === 0 && (
                                    <div className="absolute -top-6 left-0 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Next Up</span>
                                    </div>
                                )}

                                <GameCard game={game} currentUserId={user.id} role="joined" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hosted - Consistent with Profile Sections */}
            <div className="glass-card-premium p-6 md:p-8 rounded-[2.5rem] border-t border-white/10 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 relative">
                            <Crown className="w-5 h-5 text-amber-500" />
                            {/* Shine Effect */}
                            <div className="absolute inset-0 rounded-xl bg-amber-500/10 animate-pulse-slow" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-heading gradient-text text-white uppercase tracking-tight">Hosted by You</h2>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Games you're running</p>
                        </div>
                    </div>
                    <span className="badge-premium px-4 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Crown className="w-3 h-3 text-amber-500" />
                        {displayHosted.length} Created
                    </span>
                </div>

                {displayHosted.length === 0 ? (
                    <div className="p-12 border border-dashed border-white/5 rounded-3xl text-center bg-zinc-950/30 relative overflow-hidden">
                        <div className="absolute inset-0 mesh-gradient opacity-20" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                <Crown className="w-8 h-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 font-medium mb-4">You aren't hosting any games.</p>
                            <NextLink href="/host" className="text-amber-500 font-bold text-xs uppercase tracking-widest hover:text-glow transition-all inline-flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                Create your first run
                            </NextLink>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 relative z-10">
                        {displayHosted.map((game: any, idx: number) => (
                            <div
                                key={game.id}
                                className="opacity-0 animate-card-entrance hover-lift card-shine"
                                style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}
                            >
                                <GameCard game={game} currentUserId={user.id} role="host" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
