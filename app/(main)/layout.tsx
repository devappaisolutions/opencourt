"use client";

import { Calendar, Home, LogOut, MapPin, Menu, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };
    useEffect(() => {
        const fetchUserAvatar = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Check for OAuth avatar from various sources
                    const oauthAvatar = user.user_metadata?.avatar_url ||
                        user.user_metadata?.picture ||
                        user.identities?.[0]?.identity_data?.avatar_url ||
                        user.identities?.[0]?.identity_data?.picture;

                    if (oauthAvatar) {
                        setAvatarUrl(oauthAvatar);
                    } else {
                        // Check profile table as fallback
                        try {
                            const { data: profile } = await supabase
                                .from('profiles')
                                .select('avatar_url')
                                .eq('id', user.id)
                                .single();
                            if (profile?.avatar_url) {
                                setAvatarUrl(profile.avatar_url);
                            }
                        } catch (profileError) {
                            // Silently fail if profiles table doesn't exist yet
                            console.warn('Could not fetch profile avatar:', profileError);
                        }
                    }
                }
            } catch (error) {
                // Silently fail - user might not be logged in or database might not be set up
                console.warn('Error fetching user avatar:', error);
            }
        };
        fetchUserAvatar();
    }, [supabase]);

    const navItems = [
        { icon: Home, label: "Feed", href: "/dashboard" },
        { icon: Calendar, label: "Schedule", href: "/my-games" },
        { icon: PlusCircle, label: "Host", href: "/host", primary: true },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    return (
        <div className="min-h-screen bg-[#1F1D1D] pb-24 md:pb-0 md:pl-20 relative">
            {/* Background */}
            <div className="fixed inset-0 mesh-gradient opacity-40 pointer-events-none z-0" />

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-20 flex-col items-center py-8 bg-[#1F1D1D]/90 backdrop-blur-xl border-r border-white/5 z-50">
                {/* Logo */}
                <Link href="/dashboard" className="mb-10 group">
                    <div className="w-9 h-9 rounded-full bg-primary group-hover:scale-110 transition-transform" />
                </Link>

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col gap-4 w-full items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-label={item.label}
                            className={`p-3 rounded-xl transition-all group relative ${pathname === item.href
                                ? "bg-white/10 text-primary"
                                : "text-[#B8B0A6] hover:text-[#F5EFEA] hover:bg-white/5"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-all ${pathname === item.href ? "scale-105" : "group-hover:scale-105"}`} />

                            {/* Active Indicator */}
                            {pathname === item.href && (
                                <span className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-l-full" />
                            )}

                            {/* Tooltip */}
                            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#2A2827] text-[#F5EFEA] text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Menu (User Avatar) */}
                <Link
                    href="/menu"
                    className={`mt-auto mb-6 p-1.5 rounded-full transition-all group ${pathname === '/menu' ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-white/20'}`}
                    title="Menu"
                >
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Menu"
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                    )}
                </Link>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    aria-label="Logout"
                    className="mb-6 p-3 rounded-xl text-[#B8B0A6] hover:text-red-400 hover:bg-red-400/10 transition-all group"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-105 transition-all" />
                </button>
            </aside>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#1F1D1D]/95 backdrop-blur-xl border-t border-white/5 z-50 px-6 flex items-center justify-between safe-area-bottom">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 transition-all py-2 ${item.primary
                            ? "relative -top-5"
                            : pathname === item.href
                                ? "text-primary"
                                : "text-[#B8B0A6] hover:text-[#F5EFEA]"
                            }`}
                    >
                        {item.primary ? (
                            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-[#1F1D1D]">
                                <PlusCircle className="w-7 h-7 text-white" />
                            </div>
                        ) : (
                            <>
                                <item.icon className="w-5 h-5" />
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${pathname === item.href ? "text-primary" : "text-[#B8B0A6]/60"}`}>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </Link>
                ))}

                {/* Mobile Menu (User Avatar) */}
                <Link
                    href="/menu"
                    className={`flex flex-col items-center gap-1 transition-all py-2 ${pathname === '/menu' ? 'text-primary' : 'text-[#B8B0A6] hover:text-[#F5EFEA]'}`}
                >
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Menu"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                            className={`w-6 h-6 rounded-full object-cover ${pathname === '/menu' ? 'ring-2 ring-primary' : ''}`}
                        />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${pathname === '/menu' ? 'text-primary' : 'text-[#B8B0A6]/60'}`}>
                        Menu
                    </span>
                </Link>
            </nav>
        </div>
    );
}

