"use client";

import { createClient } from "@/lib/supabase/client";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Trophy, Users, Sparkles, Zap, Star, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HostGamePage() {
    const router = useRouter();
    const supabase = createClient();
    const [verificationMissing, setVerificationMissing] = useState<string[]>([]);
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
    const [usualCourts, setUsualCourts] = useState<any[]>([]);

    useEffect(() => {
        const checkUserAndProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!profile || error) {
                router.push("/profile");
                return;
            }

            const missing = [];
            if (!profile.avatar_url) missing.push("Profile Photo");
            if (!profile.instagram_handle) missing.push("Instagram Handle");

            if (missing.length > 0) {
                setVerificationMissing(missing);
            }
            setLoading(false);

            // Fetch Usual Courts
            const { data: courts } = await supabase
                .from('usual_courts')
                .select('*')
                .eq('host_id', user.id);
            if (courts) setUsualCourts(courts);
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

    if (verificationMissing.length > 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 relative">
                    <Users className="w-10 h-10" />
                    <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-[pulse-ring_2s_ease-out_infinite]" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h1 className="text-3xl font-bold text-white">Verification Required</h1>
                    <p className="text-zinc-400">
                        To host a run, we need to know who you are. This keeps our community safe and reliable.
                    </p>
                </div>

                <div className="w-full max-w-sm glass-card-premium border border-white/10 rounded-2xl p-6 text-left">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">You are missing:</p>
                    <ul className="space-y-3">
                        {verificationMissing.map((req) => (
                            <li key={req} className="flex items-center gap-3 text-rose-400 font-medium">
                                <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-xs border border-rose-500/20">❌</div>
                                {req}
                            </li>
                        ))}
                    </ul>
                </div>

                <Link
                    href="/profile"
                    className="w-full max-w-sm bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 shimmer-btn btn-glow text-center"
                >
                    Complete My Profile
                </Link>
            </div>
        );
    }

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
            max_players: format === "3v3" ? 6 : format === "4v4" ? 10 : 15,
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
                    <h1 className="text-2xl font-bold text-white uppercase italic tracking-tight">Host a <span className="gradient-text-animated">Run</span></h1>
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
                    className="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
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
                            <label className="text-sm font-medium text-white flex items-center gap-2">
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
                            <label className="text-sm font-medium text-white flex items-center gap-2">
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
                            <label className="text-sm font-medium text-white flex items-center gap-2">
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
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" /> Game Format
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {["3v3", "4v4", "5v5"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFormat(f)}
                                        className={`py-4 rounded-xl text-sm font-bold border transition-all duration-300 ${format === f
                                            ? "bg-primary text-white border-primary shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-105"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-primary" /> Competition Level
                            </label>
                            <div className="space-y-2">
                                {["Casual", "Competitive", "Elite"].map((l) => (
                                    <div
                                        key={l}
                                        onClick={() => setLevel(l)}
                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${level === l
                                            ? "bg-white/5 border-primary shadow-[0_0_20px_rgba(168,85,247,0.2)]"
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
                            <label className="text-sm font-medium text-white flex items-center gap-2">
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
                            <label className="text-sm font-medium text-white flex items-center gap-2">
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
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                🚻 Gender Constraint
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {["Mixed", "Mens", "Womens"].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGenderFilter(g)}
                                        className={`py-4 rounded-xl text-sm font-bold border transition-all ${genderFilter === g
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                🎂 Age Range
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {["All Ages", "18+", "21+", "Under 18"].map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => setAgeRange(a)}
                                        className={`py-4 rounded-xl text-sm font-bold border transition-all ${ageRange === a
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
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
                            <label className="text-sm font-medium text-white flex items-center gap-2">
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
                        className="flex-1 bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/30 uppercase tracking-widest text-xs shimmer-btn btn-glow"
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
