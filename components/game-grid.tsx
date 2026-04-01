"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GameCard } from "./game-card";
import { PlusCircle, MapPin, Flame, Sparkles, ChevronLeft, ChevronRight, Loader2, Wifi } from "lucide-react";
import NextLink from "next/link";
import { createClient } from "@/lib/supabase/client";

interface GameGridProps {
    initialGames: any[];
    userId?: string;
    joinedGameIds?: string[];
    waitlistedGameIds?: string[];
}

// Number of games to show per page
const GAMES_PER_PAGE_MOBILE = 5;
const GAMES_PER_PAGE_DESKTOP = 8;

export function GameGrid({ initialGames, userId, joinedGameIds = [], waitlistedGameIds = [] }: GameGridProps) {
    const supabase = createClient();
    const [games, setGames] = useState<any[]>(initialGames);
    const [newGameAlert, setNewGameAlert] = useState(false);
    const [newGameFading, setNewGameFading] = useState(false);
    const [filter, setFilter] = useState("All");
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(GAMES_PER_PAGE_MOBILE);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Realtime subscription — listen for game changes
    useEffect(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const channel = supabase
            .channel('dashboard_games')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'games',
            }, (payload) => {
                const newGame = payload.new as any;
                // Only add if within the 7-day window
                if (new Date(newGame.date_time) >= sevenDaysAgo) {
                    setGames(prev => {
                        if (prev.find(g => g.id === newGame.id)) return prev;
                        // Sort by date_time ascending after inserting
                        const updated = [...prev, newGame].sort(
                            (a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
                        );
                        return updated;
                    });
                    setNewGameAlert(true);
                    setNewGameFading(false);
                    // Start fade at 4s, hide at 5s
                    setTimeout(() => setNewGameFading(true), 4000);
                    setTimeout(() => { setNewGameAlert(false); setNewGameFading(false); }, 5000);
                }
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'games',
            }, (payload) => {
                const updated = payload.new as any;
                setGames(prev => prev.map(g => g.id === updated.id ? { ...g, ...updated } : g));
            })
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'games',
            }, (payload) => {
                setGames(prev => prev.filter(g => g.id !== payload.old.id));
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Ref for infinite scroll sentinel (mobile only)
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Detect mobile on mount
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setVisibleCount(GAMES_PER_PAGE_MOBILE);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
        setVisibleCount(GAMES_PER_PAGE_MOBILE);
    }, [filter]);

    const handleNearMe = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                setFilter("Near Me");
            },
            () => {
                alert("Please enable location access to use this filter.");
            }
        );
    };

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
    };

    const filteredGames = [...games].filter((game) => {
        if (filter === "All") return true;
        if (filter === "Today") {
            const today = new Date();
            const gameDate = new Date(game.date_time);
            return gameDate.getDate() === today.getDate() && gameDate.getMonth() === today.getMonth() && gameDate.getFullYear() === today.getFullYear();
        }
        if (filter === "Competitive") return game.skill_level === "Competitive";
        if (filter === "Casual") return game.skill_level === "Casual";
        if (filter === "Near Me" && userLocation) return game.latitude && game.longitude;
        return true;
    });

    if (filter === "Near Me" && userLocation) {
        filteredGames.sort((a, b) => {
            const distA = getDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
            const distB = getDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
            return distA - distB;
        });
    }

    // Desktop pagination
    const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE_DESKTOP);
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE_DESKTOP;
    const endIndex = startIndex + GAMES_PER_PAGE_DESKTOP;
    const desktopGames = filteredGames.slice(startIndex, endIndex);

    // Mobile infinite scroll
    const mobileGames = filteredGames.slice(0, visibleCount);
    const hasMoreMobileGames = filteredGames.length > visibleCount;

    // Get visible games based on device
    const visibleGames = isMobile ? mobileGames : desktopGames;

    // Desktop pagination handlers
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Mobile infinite scroll load more
    const loadMoreMobile = useCallback(() => {
        if (isLoading || !hasMoreMobileGames) return;

        setIsLoading(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + GAMES_PER_PAGE_MOBILE);
            setIsLoading(false);
        }, 300);
    }, [isLoading, hasMoreMobileGames]);

    // Infinite scroll observer for mobile
    useEffect(() => {
        if (!isMobile || !loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreMobileGames && !isLoading) {
                    loadMoreMobile();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [isMobile, hasMoreMobileGames, isLoading, loadMoreMobile]);

    const filters = [
        { label: "All", icon: null },
        { label: "Today", icon: <Flame className="w-3 h-3" /> },
        { label: "Near Me", icon: <MapPin className="w-3 h-3" /> }
    ];

    return (
        <div className="space-y-10 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="orb orb-primary w-[400px] h-[400px] top-20 -right-40" />
                <div className="orb orb-secondary w-[300px] h-[300px] bottom-40 -left-40" style={{ animationDelay: '-10s' }} />
            </div>

            {/* New Game Toast */}
            {newGameAlert && (
                <div
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 duration-300 transition-opacity duration-1000"
                    style={{ opacity: newGameFading ? 0 : 1 }}
                >
                    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs tracking-widest uppercase shadow-2xl shadow-primary/40 border border-primary/50">
                        <span className="text-base">🏀</span>
                        New game just posted!
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6 relative z-10">
                <div className="space-y-1">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary flex items-center gap-2">
                        <Wifi className="w-3 h-3" />
                        Live Games
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F5EFEA] uppercase italic leading-none font-heading gradient-text">
                        Find Your Run
                    </h1>
                    <p className="text-[#B8B0A6] text-sm font-medium">
                        <span className="text-[#F5EFEA] font-bold">{filteredGames.filter(g => new Date(g.date_time) >= new Date() && g.status !== 'cancelled' && g.status !== 'completed').length}</span> games happening near you this week
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {filters.map((f) => (
                        <button
                            key={f.label}
                            onClick={() => f.label === "Near Me" ? handleNearMe() : setFilter(f.label)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 whitespace-nowrap ${filter === f.label
                                ? "bg-primary/15 text-primary border-primary/30 active-glow-ring"
                                : "bg-white/5 text-[#B8B0A6] border-white/10 hover:bg-white/10"
                                }`}
                        >
                            {f.icon && <span className={filter === f.label ? "text-white" : "text-primary"}>{f.icon}</span>}
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop: Grid with Side Navigation */}
            {!isMobile && (
                <div className="relative z-10">
                    {/* Navigation Arrows - Fixed at screen center */}
                    {filteredGames.length > GAMES_PER_PAGE_DESKTOP && (
                        <>
                            {/* Previous Button - Left Side, fixed at screen center */}
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                                className={`fixed left-20 top-1/2 -translate-y-1/2 z-50 w-12 h-24 flex items-center justify-center rounded-2xl transition-all shadow-xl ${currentPage === 1
                                    ? 'bg-[#2A2827]/50 cursor-not-allowed opacity-30'
                                    : 'bg-[#2A2827] border border-white/10 hover:border-primary/50 hover:bg-primary/10 cursor-pointer hover:scale-105'
                                    }`}
                            >
                                <ChevronLeft className={`w-7 h-7 ${currentPage === 1 ? 'text-[#B8B0A6]/50' : 'text-primary'}`} />
                            </button>

                            {/* Next Button - Right Side, fixed at screen center */}
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                                className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-24 flex items-center justify-center rounded-2xl transition-all shadow-xl ${currentPage === totalPages
                                    ? 'bg-[#2A2827]/50 cursor-not-allowed opacity-30'
                                    : 'bg-[#2A2827] border border-white/10 hover:border-primary/50 hover:bg-primary/10 cursor-pointer hover:scale-105'
                                    }`}
                            >
                                <ChevronRight className={`w-7 h-7 ${currentPage === totalPages ? 'text-[#B8B0A6]/50' : 'text-primary'}`} />
                            </button>
                        </>
                    )}

                    {/* Desktop Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {desktopGames.length === 0 ? (
                            <div className="col-span-full py-16 text-center bg-[#2A2827] rounded-2xl border border-dashed border-white/10 mx-auto w-full">
                                <div className="w-14 h-14 rounded-full bg-[#1F1D1D] border border-white/10 flex items-center justify-center mx-auto mb-5">
                                    <Sparkles className="w-6 h-6 text-[#B8B0A6]" />
                                </div>
                                <p className="text-[#B8B0A6] font-medium">No runs found for this filter.</p>
                                <p className="text-sm text-[#B8B0A6]/60 mt-1">Try selecting "All" or browse other categories.</p>
                            </div>
                        ) : (
                            desktopGames.map((game, index) => (
                                <div
                                    key={game.id}
                                    className="h-full opacity-0 animate-card-entrance"
                                    style={{ animationDelay: `${Math.min(index, 8) * 0.08}s`, animationFillMode: 'forwards' }}
                                >
                                    <GameCard
                                        game={{
                                            ...game,
                                            image: game.image_gradient || "bg-gradient-to-br from-[#2A2827] to-[#1F1D1D]",
                                            players: game.current_players || 0,
                                            max_players: game.max_players || 10,
                                            time: new Date(game.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' }),
                                            date: new Date(game.date_time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'Asia/Manila' }),
                                            level: game.skill_level
                                        }}
                                        currentUserId={userId}
                                        isJoined={joinedGameIds.includes(game.id)}
                                        isWaitlisted={waitlistedGameIds.includes(game.id)}
                                    />
                                </div>
                            ))
                        )}

                        {/* Host Game Card - Always visible */}
                        <NextLink
                            href="/host"
                            className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-transparent p-10 flex flex-col items-center justify-center text-center gap-5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer min-h-[320px] h-full opacity-0 animate-card-entrance"
                            style={{ animationDelay: `${Math.min(desktopGames.length, 8) * 0.08}s`, animationFillMode: 'forwards' }}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#2A2827] border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-all">
                                <PlusCircle className="w-8 h-8 text-[#B8B0A6] group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-[#F5EFEA] uppercase tracking-tight group-hover:text-primary transition-colors">Host a Run</h3>
                                <p className="text-sm text-[#B8B0A6] font-medium">
                                    Got a court? Need players?<br />Take the lead.
                                </p>
                            </div>
                        </NextLink>
                    </div>
                </div>
            )}

            {/* Mobile: Grid with Infinite Scroll */}
            {isMobile && (
                <div className="grid grid-cols-1 gap-6 relative z-10">
                    {mobileGames.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-[#2A2827] rounded-2xl border border-dashed border-white/10 mx-auto w-full">
                            <div className="w-14 h-14 rounded-full bg-[#1F1D1D] border border-white/10 flex items-center justify-center mx-auto mb-5">
                                <Sparkles className="w-6 h-6 text-[#B8B0A6]" />
                            </div>
                            <p className="text-[#B8B0A6] font-medium">No runs found for this filter.</p>
                            <p className="text-sm text-[#B8B0A6]/60 mt-1">Try selecting "All" or browse other categories.</p>
                        </div>
                    ) : (
                        mobileGames.map((game, index) => (
                            <div
                                key={game.id}
                                className="h-full opacity-0 animate-card-entrance"
                                style={{ animationDelay: `${Math.min(index, 4) * 0.08}s`, animationFillMode: 'forwards' }}
                            >
                                <GameCard
                                    game={{
                                        ...game,
                                        image: game.image_gradient || "bg-gradient-to-br from-[#2A2827] to-[#1F1D1D]",
                                        players: game.current_players || 0,
                                        max_players: game.max_players || 10,
                                        time: new Date(game.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                                        date: new Date(game.date_time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
                                        level: game.skill_level
                                    }}
                                    currentUserId={userId}
                                    isJoined={joinedGameIds.includes(game.id)}
                                        isWaitlisted={waitlistedGameIds.includes(game.id)}
                                />
                            </div>
                        ))
                    )}

                    {/* Host Game Card - Always visible */}
                    <NextLink
                        href="/host"
                        className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-transparent p-10 flex flex-col items-center justify-center text-center gap-5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer min-h-[280px] h-full opacity-0 animate-card-entrance"
                        style={{ animationDelay: `${Math.min(mobileGames.length, 4) * 0.08}s`, animationFillMode: 'forwards' }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[#2A2827] border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-all">
                            <PlusCircle className="w-8 h-8 text-[#B8B0A6] group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-[#F5EFEA] uppercase tracking-tight group-hover:text-primary transition-colors">Host a Run</h3>
                            <p className="text-sm text-[#B8B0A6] font-medium">
                                Got a court? Need players?<br />Take the lead.
                            </p>
                        </div>
                    </NextLink>
                </div>
            )}

            {/* Mobile Infinite Scroll Loader */}
            {isMobile && hasMoreMobileGames && (
                <div ref={loadMoreRef} className="flex justify-center pt-4 relative z-10">
                    {isLoading && (
                        <div className="flex items-center gap-3 py-4">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            <span className="text-[#B8B0A6] text-sm">Loading more games...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Desktop Pagination Info */}
            {!isMobile && filteredGames.length > 0 && (
                <div className="flex items-center justify-center gap-4 pt-4 relative z-10">
                    <p className="text-[#B8B0A6]/60 text-sm">
                        Page <span className="text-[#F5EFEA] font-bold">{currentPage}</span> of <span className="text-[#F5EFEA] font-bold">{totalPages}</span>
                        <span className="text-[#B8B0A6]/40 ml-2">({filteredGames.length} games total)</span>
                    </p>
                </div>
            )}

            {/* Mobile Count Indicator */}
            {isMobile && filteredGames.length > 0 && (
                <p className="text-center text-[#B8B0A6]/60 text-xs relative z-10">
                    Showing {mobileGames.length} of {filteredGames.length} games
                </p>
            )}
        </div>
    );
}
