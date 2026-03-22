import { createClient } from "@/lib/supabase/server";
import { MyGamesTabs } from "@/components/my-games-tabs";
import { Calendar, PlusCircle } from "lucide-react";
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

    // Fetch Joined Games (all games user has joined as player)
    let joinedData: any[] = [];
    try {
        const { data } = await supabase
            .from('game_roster')
            .select(`
                game:games (*)
            `)
            .eq('player_id', user.id)
            .in('status', ['joined', 'checked_in']);
        joinedData = data || [];
    } catch (error) {
        console.warn('Could not fetch joined games:', error);
    }

    // Flatten joined data
    interface JoinedGameData {
        game: any;
    }
    const joinedGames = joinedData?.map((item: JoinedGameData) => item.game) || [];

    // Sort joined games by date
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
        time: new Date(g.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' }),
        date: new Date(g.date_time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'Asia/Manila' }),
    });

    const allHosted = (hostedGames || []).map(g => processGame(g, hostJoinedGameIds.has(g.id)));
    const allJoined = joinedGames.map((g: any) => processGame(g));

    // Split into upcoming vs completed
    const upcomingGames = allJoined.filter((g: any) => g.status !== 'completed');
    const completedGames = allJoined.filter((g: any) => g.status === 'completed');

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="orb orb-primary w-[500px] h-[500px] top-0 -right-40 opacity-20" style={{ animationDelay: '-3s' }} />
                <div className="orb orb-secondary w-[400px] h-[400px] bottom-20 -left-40 opacity-15" style={{ animationDelay: '-8s' }} />
            </div>

            {/* Header */}
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

            {/* Tabbed Content */}
            <MyGamesTabs
                upcomingGames={upcomingGames}
                hostedGames={allHosted}
                completedGames={completedGames}
                userId={user.id}
            />
        </div>
    );
}
