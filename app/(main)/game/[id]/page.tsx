import { GameActions } from "@/components/game-actions";
import { GameRoster } from "@/components/game-roster";
import { GameRealtimeSync } from "@/components/game-realtime-sync";
import { GameStatsForm } from "@/components/game-stats-form";
import { GameStatsDisplay } from "@/components/game-stats-display";
import { TeamGenerator } from "@/components/team-generator";
import { GameChat } from "@/components/game-chat";
import { createClient } from "@/lib/supabase/server";
import { calculateOVR } from "@/lib/team-generator";
import { Clock, MapPin, User as UserIcon, Shield, Sparkles, Zap, DollarSign, Users } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

// Force dynamic since we use params and DB
export const dynamic = 'force-dynamic';

export default async function GameDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
    const { data: roster } = await supabase
        .from('game_roster')
        .select(`
            id,
            status,
            joined_at,
            player_id,
            profiles:player_id (
                id, full_name, username, avatar_url, position, height_ft, height_in, skill_level,
                avg_points, avg_rebounds, avg_assists, avg_steals, avg_blocks, avg_turnovers
            )
        `)
        .eq('game_id', id);

    // Check if current user is host
    const { data: { user } } = await supabase.auth.getUser();
    const isHost = user?.id === game.host_id;

    // Build confirmed roster with pre-computed OVR for TeamGenerator
    const confirmedRoster = (roster ?? [])
        .filter((r: any) => ['joined', 'checked_in'].includes(r.status))
        .map((r: any) => ({
            ...r.profiles,
            ovr: calculateOVR(r.profiles),
        }));

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

    // Always fetch team assignments — derive state from actual rows, not the teams_generated flag
    // (teams_generated UPDATE can silently fail due to RLS, so we never gate on it)
    let existingTeams = null;
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
                avatar_url,
                avg_points,
                avg_rebounds,
                avg_assists,
                avg_steals,
                avg_blocks,
                avg_turnovers
            )
        `)
        .eq('game_id', id)
        .order('team_number');

    if (assignments && assignments.length > 0) {
        const withOVR = (players: any[]) =>
            players.map((p: any) => ({ ...p, ovr: calculateOVR(p) }));

        // Filter out players who have since left the game — team_assignments rows
        // are not cleaned up on roster delete, so we cross-check against confirmedRoster.
        const activeIds = new Set(confirmedRoster.map((p: any) => p.id));
        const activeAssignments = assignments.filter((a: any) => activeIds.has(a.profiles?.id));

        const team1Players = withOVR(
            activeAssignments.filter((a: any) => a.team_number === 1).map((a: any) => a.profiles)
        );
        const team2Players = withOVR(
            activeAssignments.filter((a: any) => a.team_number === 2).map((a: any) => a.profiles)
        );

        const avgOVR = (players: any[]) =>
            players.length === 0 ? 0 : Math.round(players.reduce((sum: number, p: any) => sum + p.ovr, 0) / players.length);

        existingTeams = [
            { team_number: 1, players: team1Players, avg_ovr: avgOVR(team1Players) },
            { team_number: 2, players: team2Players, avg_ovr: avgOVR(team2Players) },
        ];
    }

    // Default gradient if missing - use warm charcoal gradients instead of purple
    const bgGradient = game.image_gradient?.includes('purple') || game.image_gradient?.includes('indigo')
        ? "bg-gradient-to-br from-[#2A2827] to-[#1F1D1D]"
        : (game.image_gradient || "bg-gradient-to-br from-[#2A2827] to-[#1F1D1D]");

    return (
        <div className="space-y-6 animate-in fade-in duration-1000 pb-16 relative">
            <GameRealtimeSync gameId={id} />
            {/* Hero Section */}
            <div className={`relative rounded-2xl overflow-hidden ${bgGradient} border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.4)]`}>
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
                <div className="glare-effect" />

                <div className="relative z-10 p-5 md:p-8 space-y-4">
                    {/* Top Row: Badges + Host */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-white/10 border border-white/20 text-white">
                                {game.format}
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-primary/20 border border-primary/30 text-primary flex items-center gap-1">
                                {game.skill_level === 'Elite' && <Sparkles className="w-3 h-3" />}
                                {game.skill_level}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 ${game.status === 'completed' ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400' : game.status === 'cancelled' ? 'bg-rose-500/15 border border-rose-500/25 text-rose-400' : 'bg-primary/10 border border-primary/20 text-primary'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${game.status === 'completed' ? 'bg-emerald-400' : game.status === 'cancelled' ? 'bg-rose-400' : 'bg-primary animate-pulse'}`} />
                                {game.status}
                            </span>
                        </div>

                        {/* Host - inline */}
                        <div className="flex items-center gap-2.5 shrink-0">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center border border-white/10 overflow-hidden">
                                    {game.profiles?.avatar_url ? (
                                        <Image
                                            src={game.profiles.avatar_url}
                                            alt={`${game.profiles.username || 'Host'} avatar`}
                                            width={36}
                                            height={36}
                                            className="object-cover"
                                            sizes="36px"
                                        />
                                    ) : (
                                        <UserIcon className="w-5 h-5 text-zinc-600" />
                                    )}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-zinc-950">
                                    <Shield className="w-2 h-2 text-white" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-white leading-tight">{game.profiles?.username || 'Unknown'}</p>
                                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                                    <Zap className="w-2.5 h-2.5 inline fill-current" /> {game.profiles?.reliability_score || 100}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight uppercase italic font-heading">
                        {game.title}
                    </h1>

                    {/* Info Bar */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-300">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-semibold">{game.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-semibold">
                                {new Date(game.date_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Manila' })} at {new Date(game.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className={`font-semibold ${game.cost === 'Free' ? 'text-emerald-400' : ''}`}>
                                {game.cost === 'Free' ? 'FREE' : game.cost?.startsWith('₱') ? game.cost : `₱${game.cost}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="font-semibold">{game.current_players}/{game.max_players} Players</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-1 flex flex-wrap gap-3">
                        <GameActions
                            gameId={id}
                            userId={user?.id || ''}
                            isHost={isHost}
                            isJoined={roster?.some((p: any) => p.player_id === user?.id) || false}
                            currentPlayers={game.current_players}
                            maxPlayers={game.max_players}
                            disabled={!user}
                            houseRules={game.house_rules}
                            rosterId={userRosterEntry?.id}
                            status={game.status}
                            rosterStatus={userRosterEntry?.status}
                        />
                    </div>
                </div>
            </div>

            {/* Description & House Rules */}
            {(game.description || game.house_rules) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                    {game.description && (
                        <div className="glass-card-premium p-5 rounded-2xl border-t border-white/10 space-y-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 font-heading gradient-text">
                                <Sparkles className="w-3 h-3 text-primary" />
                                The Run
                            </h2>
                            <p className="text-zinc-300 leading-relaxed">
                                {game.description}
                            </p>
                        </div>
                    )}
                    {game.house_rules && (
                        <div className="glass-card-premium p-5 rounded-2xl border-t border-white/10 space-y-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 font-heading gradient-text">
                                📜 House Rules
                            </h2>
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {game.house_rules}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Interactive Roster Section — hidden for non-hosts when teams are published */}
            {(isHost || !game.teams_published) && (
                <div className="px-4 relative">
                    <GameRoster
                        roster={roster || []}
                        gameId={id}
                        maxPlayers={game.max_players}
                        isHost={isHost}
                    />
                </div>
            )}

            {/* Game Chat — floating FAB, renders outside page flow */}
            <GameChat
                gameId={id}
                userId={user?.id || ''}
            />

            {/* Team Generator Section */}
            <div className="px-4 relative">
                <TeamGenerator
                    gameId={id}
                    isHost={isHost}
                    gameStatus={game.status}
                    teamsGenerated={existingTeams !== null}
                    teamsPublished={game.teams_published || false}
                    confirmedRoster={confirmedRoster}
                    existingTeams={existingTeams ?? undefined}
                />
            </div>

            {/* Game Stats Section (Only for Completed Games) */}
            {game.status === 'completed' && (
                <div className="px-4 relative space-y-4">
                    {/* Stats Input Form (Only if user can add stats) */}
                    {canAddStats && user && (
                        <GameStatsForm
                            gameId={id}
                            playerId={user.id}
                            existingStats={userStats}
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
