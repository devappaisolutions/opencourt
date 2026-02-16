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
                    const oauthAvatar = user.user_metadata?.avatar_url ||
                        user.user_metadata?.picture ||
                        user.identities?.[0]?.identity_data?.avatar_url ||
                        user.identities?.[0]?.identity_data?.picture;

                    if (oauthAvatar) {
                        setAvatarUrl(oauthAvatar);
                    } else {
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
                            console.warn('Could not fetch profile avatar:', profileError);
                        }
                    }
                }
            } catch (error) {
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
        <div className="min-h-screen bg-[#1F1D1D] pb-28 md:pb-0 md:pl-24 relative">
            {/* Aurora Background */}
            <div className="fixed inset-0 aurora-bg pointer-events-none z-0" />

            {/* Floating Blobs */}
            <div className="fixed top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-primary/8 blur-3xl animate-float pointer-events-none z-0" />
            <div className="fixed bottom-1/4 right-1/4 w-52 sm:w-80 h-52 sm:h-80 rounded-full bg-accent/5 blur-3xl animate-float pointer-events-none z-0" style={{ animationDelay: '-3s' }} />

            {/* Desktop Sidebar - Floating Glass */}
            <aside className="hidden md:flex fixed left-4 top-4 bottom-4 w-[72px] flex-col items-center py-6 bg-[#1F1D1D]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                {/* Logo */}
                <Link href="/dashboard" className="mb-8 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#E8A966] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                        <span className="text-white font-heading font-bold text-sm">OC</span>
                    </div>
                </Link>

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col gap-3 w-full items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-label={item.label}
                            className={`p-3 rounded-xl transition-all group relative ${pathname === item.href
                                ? "bg-white/10 text-primary active-glow-ring"
                                : "text-[#B8B0A6] hover:text-[#F5EFEA] hover:bg-white/5"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-all ${pathname === item.href ? "scale-105" : "group-hover:scale-105"}`} />

                            {/* Active Indicator */}
                            {pathname === item.href && (
                                <span className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-l-full" />
                            )}

                            {/* Tooltip */}
                            <span className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-[#2A2827]/95 backdrop-blur-md text-[#F5EFEA] text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none shadow-xl">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Menu (User Avatar) */}
                <Link
                    href="/menu"
                    className={`mt-auto mb-4 p-1.5 rounded-full transition-all group ${pathname === '/menu' ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : 'hover:ring-2 hover:ring-white/20'}`}
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
                    className="mb-2 p-3 rounded-xl text-[#B8B0A6] hover:text-red-400 hover:bg-red-400/10 transition-all group"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-105 transition-all" />
                </button>
            </aside>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
                {children}
            </main>

            {/* Mobile Bottom Nav - Floating Glass */}
            <nav className="md:hidden fixed bottom-4 left-4 right-4 h-20 bg-[#1F1D1D]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 px-6 flex items-center justify-between"
                style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
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
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-[#E8A966] flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-[#1F1D1D] btn-glow">
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
