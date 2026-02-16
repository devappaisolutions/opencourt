import { GameActions } from "@/components/game-actions";
import { GameRoster } from "@/components/game-roster";
import { GameStatsForm } from "@/components/game-stats-form";
import { GameStatsDisplay } from "@/components/game-stats-display";
import { TeamGenerator } from "@/components/team-generator";
import { createClient } from "@/lib/supabase/server";
import { Calendar, Clock, MapPin, User as UserIcon, Shield, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

// Force dynamic since we use params and DB
export const dynamic = 'force-dynamic';

export default async function GameDetailsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch Game Details
    const { data: game, error: gameError } = await supabase
        .from('games')
        .select(`
            *,
            description,
            house_rules,
            profiles:host_id (username, avatar_url, reliability_score)
        `)
        .eq('id', id)
        .single();

    if (gameError || !game) {
        notFound();
    }

    // Fetch Roster
    const { data: roster, error: rosterError } = await supabase
        .from('game_roster')
        .select(`
            id,
            status,
            joined_at,
            player_id,
            profiles:player_id (
                id, username, avatar_url, position, height_ft, height_in, skill_level
            )
        `)
        .eq('game_id', id);

    // Check if current user is host
    const { data: { user } } = await supabase.auth.getUser();
    const isHost = user?.id === game.host_id;

    // Check if user can add stats (completed game + checked in)
    const userRosterEntry = roster?.find((r: any) => r.player_id === user?.id);
    const canAddStats = game.status === 'completed' && userRosterEntry?.status === 'checked_in';

    // Fetch game stats if game is completed
    let gameStats = null;
    let userStats = null;
    if (game.status === 'completed') {
        const { data: stats } = await supabase
            .from('game_stats')
            .select(`
                *,
                profiles:player_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('game_id', id);

        gameStats = stats || [];
        userStats = stats?.find((s: any) => s.player_id === user?.id);
    }

    // Fetch team assignments if teams have been generated
    let existingTeams = null;
    if (game.teams_generated) {
        const { data: assignments } = await supabase
            .from('team_assignments')
            .select(`
                team_number,
                profiles:player_id (
                    id,
                    full_name,
                    position,
                    height_ft,
                    height_in,
                    skill_level,
                    reliability_score,
                    avatar_url
                )
            `)
            .eq('game_id', id)
            .order('team_number');

        if (assignments && assignments.length > 0) {
            // Group by team number
            const team1Players = assignments
                .filter((a: any) => a.team_number === 1)
                .map((a: any) => a.profiles);
            const team2Players = assignments
                .filter((a: any) => a.team_number === 2)
                .map((a: any) => a.profiles);

            // Calculate average skill
            const getSkillValue = (skill: string | null) => {
                const skillOrder = { Elite: 4, Competitive: 3, Casual: 2, Beginner: 1 };
                return skillOrder[skill as keyof typeof skillOrder] || 0;
            };

            const calculateAvgSkill = (players: any[]) => {
                if (players.length === 0) return 0;
                const total = players.reduce((sum, p) => sum + getSkillValue(p.skill_level), 0);
                return total / players.length;
            };

            existingTeams = [
                {
                    team_number: 1,
                    players: team1Players,
                    avg_skill: calculateAvgSkill(team1Players),
                },
                {
                    team_number: 2,
                    players: team2Players,
                    avg_skill: calculateAvgSkill(team2Players),
                },
            ];
        }
    }

    // Default gradient if missing - use warm charcoal gradients instead of purple
    const bgGradient = game.image_gradient?.includes('purple') || game.image_gradient?.includes('indigo')
        ? "bg-gradient-to-br from-[#2A2827] to-[#1F1D1D]"
        : (game.image_gradient || "bg-gradient-to-br from-[#2A2827] to-[#1F1D1D]");

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-32 relative">
            {/* Premium Hero Section */}
            <div className={`relative rounded-[2.5rem] overflow-hidden p-8 md:p-16 ${bgGradient} border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.6)] group`}>
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-all duration-700 group-hover:bg-black/30" />

                {/* Glare Effect */}
                <div className="glare-effect" />

                <div className="relative z-10 flex flex-col lg:flex-row gap-12 justify-between items-end">
                    <div className="space-y-8 flex-1">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-3">
                            <span className="badge-premium px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
                                {game.format}
                            </span>
                            <span className={`badge-premium px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-xl border shadow-2xl flex items-center gap-1.5 ${game.skill_level === 'Elite'
                                ? 'bg-primary/20 text-primary border-primary/30'
                                : 'bg-primary/20 text-primary border-primary/30'
                                }`}>
                                {game.skill_level === 'Elite' && <Sparkles className="w-3 h-3" />}
                                {game.skill_level}
                            </span>
                        </div>

                        {/* Title & Info */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight uppercase italic font-heading">
                                {game.title}
                            </h1>
                            <div className="flex flex-col md:flex-row gap-4 md:gap-8 pt-4">
                                {/* Location */}
                                <div className="flex items-center gap-3 text-zinc-300 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/item:bg-primary/20 group-hover/item:border-primary/30 transition-all">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Location</p>
                                        <p className="font-bold text-lg">{game.location}</p>
                                    </div>
                                </div>
                                {/* Schedule */}
                                <div className="flex items-center gap-3 text-zinc-300 group/item">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/item:bg-primary/20 group-hover/item:border-primary/30 transition-all">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Schedule</p>
                                        <p className="font-bold text-lg">
                                            {new Date(game.date_time).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })} at {new Date(game.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Host Card */}
                    <div className="glass-card-premium p-6 md:p-8 rounded-[2.5rem] min-w-[300px] border-t border-white/20 shadow-2xl relative overflow-hidden group/host transition-all duration-500 hover:border-primary/50 hover-lift">
                        {/* Card Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 blur-[60px] rounded-full transition-opacity group-hover/host:opacity-100 opacity-30" />

                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 relative z-10 font-heading">Hosted By</p>
                        <div className="flex items-center gap-4 relative z-10">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner transform group-hover/host:scale-105 transition-transform">
                                    {game.profiles?.avatar_url ? (
                                        <Image
                                            src={game.profiles.avatar_url}
                                            alt={`${game.profiles.username || 'Host'} avatar`}
                                            width={64}
                                            height={64}
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    ) : (
                                        <UserIcon className="w-8 h-8 text-zinc-600" />
                                    )}
                                </div>
                                {/* Verification Badge */}
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-zinc-950 shadow-lg">
                                    <Shield className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-xl text-white tracking-tight uppercase">@{game.profiles?.username || 'Unknown'}</p>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] tracking-widest uppercase">
                                    <Zap className="w-3 h-3 fill-current" />
                                    {game.profiles?.reliability_score || 100}% Reliable
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="relative z-10 pt-12 flex justify-center lg:justify-start">
                    <GameActions
                        gameId={id}
                        userId={user?.id || ''}
                        isHost={isHost}
                        isJoined={roster?.some((p: any) => p.player_id === user?.id) || false}
                        currentPlayers={game.current_players}
                        maxPlayers={game.max_players}
                        disabled={!user}
                        houseRules={game.house_rules}
                        rosterId={roster?.find((p: any) => p.player_id === user?.id)?.id}
                        status={game.status}
                    />
                </div>
            </div>

            {/* Game Info & Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 relative z-10">
                <div className="lg:col-span-2 space-y-8">
                    {game.description && (
                        <div className="glass-card-premium p-8 rounded-[2rem] border-t border-white/10 space-y-4 hover-lift transition-all duration-500">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 font-heading gradient-text">
                                <Sparkles className="w-3 h-3 text-primary" />
                                The Run
                            </h2>
                            <p className="text-zinc-300 leading-relaxed text-lg">
                                {game.description}
                            </p>
                        </div>
                    )}

                    {game.house_rules && (
                        <div className="glass-card-premium p-8 rounded-[2rem] border-t border-white/10 space-y-4 hover-lift transition-all duration-500">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 font-heading gradient-text">
                                📜 House Rules
                            </h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                    {game.house_rules}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Game Metadata Card */}
                    <div className="glass-card-premium p-8 rounded-[2.5rem] border-t border-white/10 space-y-6 relative overflow-hidden group hover-lift transition-all duration-500">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 relative z-10 font-heading gradient-text">
                            <Zap className="w-3 h-3 text-primary" />
                            Run Intel
                        </h2>

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-zinc-500 font-medium">Format</span>
                                <span className="text-white font-bold">{game.format}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-zinc-500 font-medium">Level</span>
                                <span className="text-white font-bold">{game.skill_level}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-zinc-500 font-medium">Cost</span>
                                <span className={`font-bold ${game.cost === 'Free' ? 'text-emerald-400' : 'text-white'}`}>
                                    {game.cost === 'Free' ? 'FREE' : `$${game.cost}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-zinc-500 font-medium">Status</span>
                                <span className="text-primary font-bold uppercase tracking-widest text-[10px] flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    {game.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Roster Section */}
            <div className="px-4 relative z-10">
                <GameRoster
                    roster={roster || []}
                    gameId={id}
                    maxPlayers={game.max_players}
                    isHost={isHost}
                />
            </div>

            {/* Team Generator Section */}
            <div className="px-4 relative z-10">
                <TeamGenerator
                    gameId={id}
                    isHost={isHost}
                    gameStatus={game.status}
                    teamsGenerated={game.teams_generated || false}
                    existingTeams={existingTeams || undefined}
                />
            </div>

            {/* Game Stats Section (Only for Completed Games) */}
            {game.status === 'completed' && (
                <div className="px-4 relative z-10 space-y-8">
                    {/* Stats Input Form (Only if user can add stats) */}
                    {canAddStats && user && (
                        <GameStatsForm
                            gameId={id}
                            playerId={user.id}
                            existingStats={userStats}
                            onSuccess={() => window.location.reload()}
                        />
                    )}

                    {/* Stats Display */}
                    {gameStats && gameStats.length > 0 && (
                        <GameStatsDisplay
                            stats={gameStats}
                            currentUserId={user?.id}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
