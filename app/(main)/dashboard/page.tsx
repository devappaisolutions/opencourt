import { createClient } from "@/lib/supabase/server";
import { GameGrid } from "@/components/game-grid";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch Games from DB
    const { data: games } = await supabase
        .from('games')
        .select('*')
        .order('date_time', { ascending: true });

    // Fetch Current User
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="animate-in fade-in duration-1000 relative">
            {/* Background Mesh - Very Subtle */}
            <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none z-0" />

            <GameGrid initialGames={games || []} userId={user?.id} />
        </div>
    );
}
