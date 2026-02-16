"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Calendar,
    ChevronRight,
    HelpCircle,
    Home,
    LogOut,
    MapPin,
    PlusCircle,
    Settings,
    Shield,
    Star,
    Trophy,
    User,
    Users,
    Zap
} from "lucide-react";

interface UserProfile {
    id: string;
    display_name: string;
    avatar_url: string | null;
    email?: string;
}

export default function MenuPage() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single();

                setUser({
                    id: authUser.id,
                    display_name: profile?.display_name || authUser.email?.split('@')[0] || 'User',
                    avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url || null,
                    email: authUser.email
                });
            }
            setLoading(false);
        };
        fetchUser();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    const shortcuts = [
        { icon: Home, label: "Dashboard", href: "/dashboard", color: "text-primary" },
        { icon: MapPin, label: "Map", href: "/map", color: "text-emerald-400" },
        { icon: Calendar, label: "My Schedule", href: "/my-games", color: "text-amber-400" },
        { icon: PlusCircle, label: "Host Run", href: "/host", color: "text-blue-400" },
    ];

    const menuItems = [
        { icon: Trophy, label: "Leaderboard", href: "#", description: "Top players" },
        { icon: Users, label: "Find Players", href: "#", description: "Connect with ballers" },
        { icon: Star, label: "Favorites", href: "#", description: "Saved games & courts" },
        { icon: Zap, label: "My Stats", href: "/profile", description: "Performance & reliability" },
    ];

    const settingsItems = [
        { icon: Settings, label: "Settings", href: "#" },
        { icon: Shield, label: "Privacy", href: "#" },
        { icon: HelpCircle, label: "Help & Support", href: "#" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-heading text-white">Menu</h1>
                <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <Settings className="w-5 h-5 text-[#B8B0A6]" />
                </button>
            </div>

            {/* Profile Card */}
            <Link href="/profile" className="block">
                <div className="flex items-center gap-4 p-4 rounded-2xl glass-card-premium holographic border border-white/5 hover:border-primary/30 transition-all group">
                    {/* Avatar */}
                    <div className="relative">
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.display_name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover:border-primary/50 transition-all"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                                <User className="w-7 h-7 text-primary" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#2A2827]" />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                            {user?.display_name}
                        </h2>
                        <p className="text-sm text-[#B8B0A6]">View your profile</p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-[#B8B0A6] group-hover:text-primary transition-colors" />
                </div>
            </Link>

            {/* Quick Shortcuts */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold font-heading text-[#B8B0A6] uppercase tracking-wider px-1">
                    Your Shortcuts
                </h3>
                <div className="grid grid-cols-4 gap-3">
                    {shortcuts.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#2A2827] border border-white/5 hover:border-primary/30 hover:bg-[#2A2827]/80 transition-all group hover-lift"
                        >
                            <div className={`p-3 rounded-xl bg-white/5 ${item.color} group-hover:scale-110 transition-all`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-[#B8B0A6] text-center uppercase tracking-wider">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 gap-3">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-[#2A2827] border border-white/5 hover:border-primary/30 transition-all group card-shine hover-lift"
                    >
                        <div className="p-2 rounded-xl bg-white/5 text-primary group-hover:scale-110 transition-all">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors">
                                {item.label}
                            </h4>
                            <p className="text-[10px] text-[#B8B0A6] truncate">{item.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Settings Section */}
            <div className="space-y-2 pt-4 border-t border-white/5">
                {settingsItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-all group glass-card"
                    >
                        <item.icon className="w-5 h-5 text-[#B8B0A6] group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium text-[#F5EFEA]">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-[#B8B0A6]/50 ml-auto" />
                    </Link>
                ))}
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all font-bold"
            >
                <LogOut className="w-5 h-5" />
                Log Out
            </button>

            {/* Footer */}
            <p className="text-center text-[10px] text-[#B8B0A6]/40 pt-4">
                Open Court • v1.0.0
            </p>
        </div>
    );
}
