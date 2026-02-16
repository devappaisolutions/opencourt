"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { ChevronRight, Ruler, Trophy, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState("");
    const [position, setPosition] = useState<string | null>(null);
    const [heightFt, setHeightFt] = useState(5);
    const [heightIn, setHeightIn] = useState(10);
    const [skillLevel, setSkillLevel] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
            }
        };
        getUser();
    }, [router, supabase]);

    const handleSubmit = async () => {
        if (!user || !position || !skillLevel || !username) return;
        setLoading(true);

        const { error } = await supabase.from("profiles").insert({
            id: user.id,
            username,
            full_name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
            position,
            height_ft: heightFt,
            height_in: heightIn,
            skill_level: skillLevel,
            reliability_score: 100,
        });

        if (error) {
            console.error("Error creating profile:", error);
            alert("Failed to create profile: " + error.message);
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    const positions = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"];
    const skills = ["Beginner", "Casual", "Competitive", "Elite"];

    return (
        <main className="min-h-screen bg-[#1F1D1D] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Aurora Background */}
            <div className="absolute inset-0 aurora-bg pointer-events-none" />

            {/* Floating Blob */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/12 rounded-full blur-[120px] pointer-events-none animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/8 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '-2s' }} />

            <div className="glass-card-premium w-full max-w-lg p-8 rounded-3xl space-y-8 relative z-10 animate-slide-up">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-heading font-bold gradient-text">
                        Claim Your Baller Card
                    </h1>
                    <p className="text-[#B8B0A6] text-sm">
                        Complete your profile to join the ecosystem.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Handle */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-primary" /> Handle (Username)
                        </label>
                        <input
                            type="text"
                            placeholder="@jordan23"
                            className="w-full bg-[#1F1D1D]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 input-premium transition-all placeholder:text-zinc-600"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Position */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" /> Main Position
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {positions.map((pos) => (
                                <button
                                    key={pos}
                                    onClick={() => setPosition(pos)}
                                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${position === pos
                                            ? "bg-primary/20 text-primary border-primary/40 active-glow-ring"
                                            : "bg-[#1F1D1D]/60 text-zinc-400 border-white/5 hover:border-white/20 hover:bg-white/5"
                                        }`}
                                >
                                    {pos}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Height */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-primary" /> Height
                        </label>
                        <div className="flex gap-4">
                            <div className="flex-1 flex items-center gap-2 bg-[#1F1D1D]/60 rounded-xl px-4 border border-white/10">
                                <input
                                    type="number"
                                    className="w-full bg-transparent py-3 text-center focus:outline-none input-premium"
                                    value={heightFt}
                                    onChange={(e) => setHeightFt(Number(e.target.value))}
                                />
                                <span className="text-[#B8B0A6] text-sm">ft</span>
                            </div>
                            <div className="flex-1 flex items-center gap-2 bg-[#1F1D1D]/60 rounded-xl px-4 border border-white/10">
                                <input
                                    type="number"
                                    className="w-full bg-transparent py-3 text-center focus:outline-none input-premium"
                                    value={heightIn}
                                    onChange={(e) => setHeightIn(Number(e.target.value))}
                                />
                                <span className="text-[#B8B0A6] text-sm">in</span>
                            </div>
                        </div>
                    </div>

                    {/* Skill */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" /> Self-Assessed Skill
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {skills.map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => setSkillLevel(skill)}
                                    className={`px-1 py-2.5 rounded-xl text-[10px] font-medium border transition-all ${skillLevel === skill
                                            ? "bg-primary/20 text-primary border-primary/40 active-glow-ring"
                                            : "bg-[#1F1D1D]/60 text-zinc-400 border-white/5 hover:border-white/20 hover:bg-white/5"
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !username || !position || !skillLevel}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-[#E8A966] text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shimmer-btn btn-glow"
                >
                    {loading ? "Creating Profile..." : "Create Baller ID"} <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </main>
    );
}
