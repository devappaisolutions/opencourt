import { createClient } from "@/lib/supabase/server";
import { GameGrid } from "@/components/game-grid";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch Current User
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Games from DB
    let games = [];
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const isoDate = sevenDaysAgo.toISOString();

        const { data, error } = await supabase
            .from('games')
            .select('*')
            .gte('date_time', isoDate)
            .order('date_time', { ascending: true });

        if (!error && data) {
            games = data;
        }
    } catch (error) {
        console.warn('Could not fetch games:', error);
    }

    // Fetch games the user has already joined (to show correct button state)
    let joinedGameIds: string[] = [];
    if (user) {
        try {
            const { data } = await supabase
                .from('game_roster')
                .select('game_id')
                .eq('player_id', user.id)
                .in('status', ['joined', 'checked_in', 'waitlist']);
            joinedGameIds = (data || []).map((r: any) => r.game_id);
        } catch (error) {
            console.warn('Could not fetch roster:', error);
        }
    }

    return (
        <div className="animate-in fade-in duration-1000 relative">
            {/* Background Mesh - Very Subtle */}
            <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none z-0" />

            <GameGrid initialGames={games} userId={user?.id} joinedGameIds={joinedGameIds} />
        </div>
    );
}
