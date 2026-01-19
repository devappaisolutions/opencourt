"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Sparkles, Radio } from "lucide-react";

export default function MapPage() {
    // Dynamic import to avoid SSR issues with Leaflet
    const MapView = useMemo(() => dynamic(
        () => import('@/components/map-view'),
        {
            loading: () => (
                <div className="flex items-center justify-center h-full bg-zinc-950">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
                            <Sparkles className="w-8 h-8 text-primary animate-spin-slow" />
                        </div>
                        <p className="text-zinc-500 font-medium">Loading Map...</p>
                    </div>
                </div>
            ),
            ssr: false
        }
    ), []);

    return (
        <div className="h-[calc(100vh-100px)] w-full rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
            {/* Header Badge */}
            <div className="absolute top-6 left-6 z-[1000] glass-card-premium px-5 py-3 rounded-2xl border-t border-white/20 shadow-2xl flex items-center gap-3 group animate-in fade-in slide-in-from-left-4 duration-1000">
                {/* Pulsing Live Indicator */}
                <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]" />
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <div>
                    <h1 className="text-xs font-bold text-white uppercase italic tracking-widest">Live Map</h1>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Real-time game locations</p>
                </div>
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse ml-2" />
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-6 left-6 z-[1000] glass-card-premium px-4 py-3 rounded-xl border-t border-white/20 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-1000 delay-300">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Legend</p>
                <div className="flex items-center gap-4 text-[10px]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        <span className="text-zinc-400">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        <span className="text-zinc-400">Almost Full</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-zinc-600" />
                        <span className="text-zinc-400">Full</span>
                    </div>
                </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none z-[999] rounded-bl-[4rem]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none z-[999] rounded-tr-[4rem]" />

            <MapView />
        </div>
    );
}
