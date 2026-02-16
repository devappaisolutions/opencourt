"use client";

import { createClient } from "@/lib/supabase/client";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Trophy, Users, Sparkles, Zap, Star, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HostGamePage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);

    // State previously removed by accident
    const [step, setStep] = useState(1);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<any>(null);

    // Form State
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("Tomorrow");
    const [time, setTime] = useState("19:00");
    const [format, setFormat] = useState("5v5");
    const [level, setLevel] = useState("Competitive");
    const [cost, setCost] = useState("Free");
    const [description, setDescription] = useState("");
    const [houseRules, setHouseRules] = useState("");
    const [ageRange, setAgeRange] = useState("All Ages");
    const [genderFilter, setGenderFilter] = useState("Mixed");
    const [maxPlayers, setMaxPlayers] = useState(10);
    const [usualCourts, setUsualCourts] = useState<any[]>([]);

    useEffect(() => {
        const checkUserAndProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }
                setUser(user);

                try {
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (!profile || error) {
                        // Profile doesn't exist or error occurred - allow user to continue anyway
                        console.warn('Profile not found or error:', error);
                    }
                } catch (profileError) {
                    // Silently fail if profiles table doesn't exist yet
                    console.warn('Could not fetch profile:', profileError);
                }

                setLoading(false);

                // Fetch Usual Courts (optional feature)
                try {
                    const { data: courts } = await supabase
                        .from('usual_courts')
                        .select('*')
                        .eq('host_id', user.id);
                    if (courts) setUsualCourts(courts);
                } catch (courtsError) {
                    // Silently fail if usual_courts table doesn't exist
                    console.warn('Could not fetch usual courts:', courtsError);
                }
            } catch (error) {
                console.error('Error checking user:', error);
                router.push("/login");
            }
        };
        checkUserAndProfile();
    }, [supabase, router]);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
                    <Sparkles className="w-8 h-8 text-primary animate-spin-slow" />
                </div>
                <p className="text-zinc-500 font-medium">Checking credentials...</p>
            </div>
        </div>
    );



    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handlePublish = async () => {
        if (!user) return alert("You must be logged in to host.");

        // Construct DateTime (Rough approximation for MVP)
        const gameDate = new Date();
        if (date === "Tomorrow") {
            gameDate.setDate(gameDate.getDate() + 1);
        } else if (date !== "Today") {
            const parts = date.split('-');
            gameDate.setFullYear(parseInt(parts[0]));
            gameDate.setMonth(parseInt(parts[1]) - 1);
            gameDate.setDate(parseInt(parts[2]));
        }

        // Parse time
        const [hours, minutes] = time.split(':');
        gameDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Select a random gradient for the card
        const gradients = [
            "bg-gradient-to-br from-blue-900 to-slate-900",
            "bg-gradient-to-br from-orange-900 to-red-900",
            "bg-gradient-to-br from-purple-900 to-indigo-900",
            "bg-gradient-to-br from-emerald-900 to-teal-900"
        ];
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

        const { error } = await supabase.from('games').insert({
            host_id: user.id,
            title: `${format} ${level} Run`,
            location,
            date_time: gameDate.toISOString(),
            format,
            skill_level: level,
            cost: cost === "0" || cost === "" ? "Free" : cost,
            image_gradient: randomGradient,
            max_players: maxPlayers,
            description: description || null,
            house_rules: houseRules || null,
            age_range: ageRange || null,
            gender_filter: genderFilter || null
        });

        if (error) {
            console.error("Error creating game:", JSON.stringify(error, null, 2));
            const errorMsg = error.message || error.details || JSON.stringify(error) || 'Unknown error';
            const errorCode = error.code || error.hint || 'Unknown Code';
            alert(`Failed to create game: ${errorMsg} (${errorCode})`);
        } else {
            router.push("/dashboard");
            router.refresh(); // Refresh server components
        }
    };

    const steps = [
        { num: 1, label: "Location" },
        { num: 2, label: "Format" },
        { num: 3, label: "Details" },
        { num: 4, label: "Filters" },
        { num: 5, label: "Confirm" }
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="orb orb-primary w-[500px] h-[500px] top-0 -right-40 opacity-20" style={{ animationDelay: '-3s' }} />
                <div className="orb orb-secondary w-[300px] h-[300px] bottom-40 -left-40 opacity-15" style={{ animationDelay: '-8s' }} />
            </div>

            {/* Floating Blob */}
            <div className="absolute top-20 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-float pointer-events-none z-0" />

            {/* Header */}
            <div className="flex items-center gap-4 relative z-10">
                <Link href="/dashboard" className="p-2.5 rounded-full bg-zinc-900 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                    <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                </Link>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-primary animate-spin-slow" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Create Game</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white uppercase italic tracking-tight font-heading gradient-text">Host a Run</h1>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between relative z-10">
                {steps.map((s, idx) => (
                    <div key={s.num} className="flex items-center flex-1 last:flex-none">
                        <div className={`flex flex-col items-center group ${step >= s.num ? 'cursor-pointer' : ''}`} onClick={() => step >= s.num && setStep(s.num)}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 relative ${step === s.num
                                ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-110'
                                : step > s.num
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-zinc-900 text-zinc-600 border border-white/5'
                                }`}>
                                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                                {step === s.num && (
                                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-[pulse-ring_2s_ease-out_infinite]" />
                                )}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest mt-2 transition-colors ${step === s.num ? 'text-primary' : step > s.num ? 'text-emerald-400' : 'text-zinc-600'
                                }`}>
                                {s.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`flex-1 h-px mx-2 transition-all duration-500 ${step > s.num ? 'bg-emerald-500' : 'bg-zinc-800'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden relative z-10">
                <div
                    className="h-full bg-gradient-to-r from-primary to-[#E8A966] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    style={{ width: `${(step / 5) * 100}%` }}
                />
            </div>

            <div className="glass-card-premium p-8 rounded-[2rem] space-y-6 relative z-10 border-t border-white/10">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                {/* Step 1: Logistics */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                <MapPin className="w-4 h-4 text-primary" /> Where are we playing?
                            </label>
                            <input
                                type="text"
                                placeholder="Enter court name or address"
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-zinc-600 input-premium"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            {usualCourts.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">My Usual Courts</p>
                                    <div className="flex flex-wrap gap-2">
                                        {usualCourts.map((court) => (
                                            <button
                                                key={court.id}
                                                onClick={() => setLocation(court.name)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${location === court.name ? 'bg-primary/20 border-primary/50 text-white' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-white hover:border-white/20'}`}
                                            >
                                                {court.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                <Calendar className="w-4 h-4 text-primary" /> When?
                            </label>
                            <div className="flex gap-2">
                                {["Today", "Tomorrow"].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDate(d)}
                                        className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${date === d
                                            ? "bg-white text-black border-white shadow-lg shadow-white/10"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20"
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                                <div className="relative flex-1">
                                    <input
                                        ref={dateInputRef}
                                        type="date"
                                        onChange={(e) => setDate(e.target.value)}
                                        className="sr-only"
                                    />
                                    <button
                                        onClick={() => {
                                            const input = dateInputRef.current as HTMLInputElement;
                                            if (input) {
                                                if ('showPicker' in input) {
                                                    (input as HTMLInputElement).showPicker();
                                                } else {
                                                    (input as HTMLInputElement).focus();
                                                }
                                            }
                                        }}
                                        className={`w-full h-full py-3 rounded-xl text-sm font-medium border transition-all ${date !== "Today" && date !== "Tomorrow"
                                            ? "bg-white text-black border-white"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20"
                                            }`}
                                    >
                                        {date !== "Today" && date !== "Tomorrow" ? new Date(date).toLocaleDateString() : "Pick Date"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                <Clock className="w-4 h-4 text-primary" /> Start Time
                            </label>
                            <input
                                type="time"
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all scheme-dark input-premium"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Format */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                <Users className="w-4 h-4 text-primary" /> Game Format
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {["3v3", "4v4", "5v5"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFormat(f)}
                                        className={`py-4 rounded-xl text-sm font-bold border transition-all duration-300 ${format === f
                                            ? "active-glow-ring bg-primary/20 text-primary border-primary/40 scale-105"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                <Users className="w-4 h-4 text-primary" /> Max Players: {maxPlayers}
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="25"
                                step="5"
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                            <div className="flex justify-between text-xs text-zinc-500 font-medium">
                                <span>10</span>
                                <span>15</span>
                                <span>20</span>
                                <span>25</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                <Trophy className="w-4 h-4 text-primary" /> Competition Level
                            </label>
                            <div className="space-y-2">
                                {["Casual", "Competitive", "Elite"].map((l) => (
                                    <div
                                        key={l}
                                        onClick={() => setLevel(l)}
                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${level === l
                                            ? "active-glow-ring bg-primary/20 text-primary border-primary/40"
                                            : "bg-zinc-900/50 border-white/5 hover:border-white/10"
                                            }`}
                                    >
                                        <span className={`flex items-center gap-2 ${level === l ? "text-white" : "text-zinc-400"}`}>
                                            {l === "Elite" && <Sparkles className="w-4 h-4 text-amber-500" />}
                                            {l}
                                        </span>
                                        {level === l && <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)]" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Description & Rules */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                📝 Game Description
                            </label>
                            <textarea
                                placeholder="Add some details about the run (e.g. Bring a dark and light jersey)"
                                className="w-full h-32 bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-zinc-600 resize-none input-premium"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                📜 House Rules
                            </label>
                            <textarea
                                placeholder="Any specific rules? (e.g. No trash talk, 2s and 3s, winner stays)"
                                className="w-full h-32 bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-zinc-600 resize-none input-premium"
                                value={houseRules}
                                onChange={(e) => setHouseRules(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Step 4: Filtering */}
                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                🚻 Gender Constraint
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {["Mixed", "Mens", "Womens"].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGenderFilter(g)}
                                        className={`py-4 rounded-xl text-sm font-bold border transition-all ${genderFilter === g
                                            ? "active-glow-ring bg-primary/20 text-primary border-primary/40"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                🎂 Age Range
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {["All Ages", "18+", "21+", "Under 18"].map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => setAgeRange(a)}
                                        className={`py-4 rounded-xl text-sm font-bold border transition-all ${ageRange === a
                                            ? "active-glow-ring bg-primary/20 text-primary border-primary/40"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5"
                                            }`}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Confirmation */}
                {step === 5 && (
                    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
                        {/* Summary Card */}
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4 relative overflow-hidden">
                            <div className="absolute inset-0 holographic rounded-2xl opacity-30" />
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">{format} {level} Run</h3>
                                    <p className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-primary" />
                                        {location || "No location set"}
                                    </p>
                                </div>
                                <span className="px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-xl border border-white/10">
                                    {date} @ {time}
                                </span>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Total Slots</p>
                                    <p className="text-white font-bold">{format === "3v3" ? 6 : format === "4v4" ? 10 : 15} Players</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Filter</p>
                                    <p className="text-white font-bold">{genderFilter} • {ageRange}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2 font-heading">
                                💵 Cost per player
                            </label>
                            <input
                                type="text"
                                placeholder="Free"
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600 input-premium"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 flex gap-4 relative z-10">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-4 rounded-xl text-white font-medium hover:bg-white/5 transition-colors border border-white/5 hover:border-white/20"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={step === 5 ? handlePublish : handleNext}
                        className="flex-1 bg-gradient-to-r from-primary to-[#E8A966] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/30 uppercase tracking-widest text-xs shimmer-btn btn-glow"
                    >
                        {step === 5 ? (
                            <>
                                <Zap className="w-4 h-4 fill-current" />
                                Publish Game
                            </>
                        ) : (
                            <>
                                Next Step <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
