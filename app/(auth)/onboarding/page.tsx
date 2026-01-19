"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Camera, ChevronRight, Ruler, Trophy, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    // Form State
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
                // Pre-fill name if available
                if (user.user_metadata.full_name) {
                    // Maybe derive a username or just leave blank for now
                }
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
            reliability_score: 100, // Default start
        });

        if (error) {
            console.error("Error creating profile:", error);
            alert("Failed to create profile: " + error.message);
            setLoading(false);
        } else {
            router.push("/dashboard"); // Or home
        }
    };

    const positions = ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"];
    const skills = ["Beginner", "Casual", "Competitive", "Elite"];

    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="glass-card w-full max-w-lg p-8 rounded-3xl space-y-8 relative z-10 animate-in slide-in-from-bottom-5 duration-700">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Claim Your Baller Card
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Complete your profile to join the ecosystem.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Step 1: Identity */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-primary" /> Handle (Username)
                        </label>
                        <input
                            type="text"
                            placeholder="@jordan23"
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Step 2: Position */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" /> Main Position
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {positions.map((pos) => (
                                <button
                                    key={pos}
                                    onClick={() => setPosition(pos)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${position === pos
                                            ? "bg-primary text-white border-primary"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20"
                                        }`}
                                >
                                    {pos}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 3: Height */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-primary" /> Height
                        </label>
                        <div className="flex gap-4">
                            <div className="flex-1 flex items-center gap-2 bg-zinc-900/50 rounded-xl px-4 border border-white/10">
                                <input
                                    type="number"
                                    className="w-full bg-transparent py-3 text-center focus:outline-none"
                                    value={heightFt}
                                    onChange={(e) => setHeightFt(Number(e.target.value))}
                                />
                                <span className="text-muted-foreground text-sm">ft</span>
                            </div>
                            <div className="flex-1 flex items-center gap-2 bg-zinc-900/50 rounded-xl px-4 border border-white/10">
                                <input
                                    type="number"
                                    className="w-full bg-transparent py-3 text-center focus:outline-none"
                                    value={heightIn}
                                    onChange={(e) => setHeightIn(Number(e.target.value))}
                                />
                                <span className="text-muted-foreground text-sm">in</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Skill */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" /> Self-Assessed Skill
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {skills.map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => setSkillLevel(skill)}
                                    className={`px-1 py-2 rounded-lg text-[10px] font-medium border transition-all ${skillLevel === skill
                                            ? "bg-primary text-white border-primary"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20"
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
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                >
                    {loading ? "Creating Profile..." : "Create Baller ID"} <ChevronRight className="w-5 h-5" />
                </button>

            </div>
        </main>
    );
}
