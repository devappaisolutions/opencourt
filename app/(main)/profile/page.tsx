"use client";

import { createClient } from "@/lib/supabase/client";
import { Camera, ChevronRight, Ruler, Save, Shield, Trophy, User as UserIcon, Sparkles, Zap, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [position, setPosition] = useState("PG");
    const [skillLevel, setSkillLevel] = useState("Casual");
    const [heightFt, setHeightFt] = useState(5);
    const [heightIn, setHeightIn] = useState(9);
    const [username, setUsername] = useState("");
    const [instagram, setInstagram] = useState("");

    // Derived Verification State
    const hasAvatar = !!profile?.avatar_url;
    const hasSocial = !!instagram;
    const isVerified = hasAvatar && hasSocial;

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            // Get OAuth avatar if profile doesn't have one
            let oauthAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || user.identities?.[0]?.identity_data?.avatar_url;

            // If it's a Facebook avatar, request higher resolution
            if (oauthAvatar && oauthAvatar.includes('facebook')) {
                // Facebook graph API allows specifying size with ?width= and ?height= or ?type=large
                if (!oauthAvatar.includes('?')) {
                    oauthAvatar = `${oauthAvatar}?width=500&height=500`;
                } else if (!oauthAvatar.includes('width=') && !oauthAvatar.includes('type=')) {
                    oauthAvatar = `${oauthAvatar}&width=500&height=500`;
                }
            }

            const profileData = data || {};

            // Use profile avatar if exists, otherwise use OAuth avatar
            const finalProfile = {
                ...profileData,
                avatar_url: profileData.avatar_url || oauthAvatar
            };

            if (data || oauthAvatar) {
                setProfile(finalProfile);
                setUsername(finalProfile.username || "");
                // Convert full position name to abbreviation
                const reversePositionMap: Record<string, string> = {
                    'Point Guard': 'PG',
                    'Shooting Guard': 'SG',
                    'Small Forward': 'SF',
                    'Power Forward': 'PF',
                    'Center': 'C'
                };
                setPosition(reversePositionMap[finalProfile.position] || finalProfile.position || "PG");
                setSkillLevel(finalProfile.skill_level || "Casual");
                setHeightFt(finalProfile.height_ft || 5);
                setHeightIn(finalProfile.height_in || 9);
                setInstagram(finalProfile.instagram_handle || "");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Map abbreviated positions to full names for database constraint
    const positionMap: Record<string, string> = {
        'PG': 'Point Guard',
        'SG': 'Shooting Guard',
        'SF': 'Small Forward',
        'PF': 'Power Forward',
        'C': 'Center'
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const updates = {
                id: user.id,
                username,
                instagram_handle: instagram,
                position: positionMap[position] || position,
                skill_level: skillLevel,
                height_ft: heightFt,
                height_in: heightIn,
                updated_at: new Date().toISOString(),
            };

            console.log('Saving profile with:', updates);
            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                console.error('Supabase error:', error);
                alert(`Error updating profile: ${error.message || error.details || JSON.stringify(error)}`);
                return;
            }

            router.refresh();
            alert('Profile updated!');
            getProfile(); // Refresh local state to check verification
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert(`Error updating profile: ${error?.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
                        <Sparkles className="w-8 h-8 text-primary animate-spin-slow" />
                    </div>
                    <p className="text-zinc-500 font-medium">Loading your locker...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="orb orb-primary w-[500px] h-[500px] top-20 -right-40 opacity-20" style={{ animationDelay: '-5s' }} />
                <div className="orb orb-secondary w-[400px] h-[400px] bottom-40 -left-40 opacity-15" style={{ animationDelay: '-10s' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-primary animate-spin-slow" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Player Card</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white uppercase italic tracking-tight">Your <span className="gradient-text-animated">Locker</span></h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Manage your player card and stats.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shimmer-btn btn-glow"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Verification Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between relative overflow-hidden transition-all duration-500 hover-lift ${isVerified ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"}`}>
                {/* Banner Glow */}
                <div className={`absolute inset-0 ${isVerified ? 'bg-emerald-500/5' : 'bg-amber-500/5'} blur-xl`} />

                <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${isVerified ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                        <Shield className="w-5 h-5" />
                        {isVerified && (
                            <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-[pulse-ring_2s_ease-out_infinite]" />
                        )}
                    </div>
                    <div>
                        <h3 className={`font-bold ${isVerified ? "text-emerald-400" : "text-amber-400"}`}>
                            {isVerified ? "Verified Baller" : "Verification Pending"}
                        </h3>
                        <p className="text-xs text-zinc-400">
                            {isVerified ? "You are fully verified and ready to host/join." : "Complete your profile to join games."}
                        </p>
                    </div>
                </div>

                {!isVerified && (
                    <div className="flex gap-3 text-xs font-bold relative z-10">
                        <span className={`px-3 py-1 rounded-full ${hasAvatar ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                            {hasAvatar ? "✓ Photo" : "○ Photo"}
                        </span>
                        <span className={`px-3 py-1 rounded-full ${hasSocial ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                            {hasSocial ? "✓ Social" : "○ Social"}
                        </span>
                    </div>
                )}
            </div>

            {/* Main Player Card */}
            <div className="glass-card-premium rounded-[2.5rem] border-t border-white/10 relative overflow-hidden holographic card-shine">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-20" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none translate-y-20" />

                {/* Holographic Border Effect */}
                <div className="absolute inset-0 rounded-[2.5rem] p-[1px] bg-gradient-to-br from-primary/30 via-transparent to-indigo-500/30 opacity-50 pointer-events-none" />

                {/* Avatar & Reliability */}
                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10 px-8 pt-8 pb-6">
                    {/* Avatar Container */}
                    <div className="relative group shrink-0">
                        {/* Outer Glow Ring */}
                        <div className="absolute inset-[-8px] rounded-full bg-gradient-to-br from-primary to-indigo-500 opacity-30 blur-lg group-hover:opacity-50 transition-opacity" />

                        <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-white/10 flex items-center justify-center overflow-hidden relative shadow-2xl group-hover:border-primary/30 transition-all">
                            {profile?.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                    priority
                                />
                            ) : (
                                <UserIcon className="w-12 h-12 text-zinc-500" />
                            )}

                            {/* Glare overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                        </div>

                        {/* Camera Button */}
                        <div className="absolute bottom-1 right-1 bg-zinc-900 border border-white/10 p-2.5 rounded-full cursor-pointer hover:bg-primary/20 hover:border-primary/30 transition-colors shadow-lg group-hover:scale-110">
                            <Camera className="w-4 h-4 text-white" />
                        </div>

                        {/* Verification Badge */}
                        {isVerified && (
                            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-zinc-950 shadow-lg animate-bounce-subtle">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left w-full">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-2 justify-center md:justify-start">
                                    <Zap className="w-3 h-3 text-primary" />
                                    Baller Tag
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-transparent text-2xl md:text-4xl font-bold text-white focus:outline-none border-b-2 border-transparent focus:border-primary/50 transition-all placeholder:text-zinc-700 uppercase italic tracking-tighter input-premium"
                                    placeholder="Enter Username"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Instagram</label>
                                <div className="flex items-center gap-1 text-xl text-white">
                                    <span className="text-zinc-500">@</span>
                                    <input
                                        type="text"
                                        value={instagram}
                                        onChange={(e) => setInstagram(e.target.value)}
                                        className="w-full bg-transparent font-bold focus:outline-none border-b-2 border-transparent focus:border-primary/50 transition-all placeholder:text-zinc-700 input-premium"
                                        placeholder="instagram_handle"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reliability Score Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm">
                            <Shield className="w-4 h-4" />
                            <span className="text-2xl font-black">{profile?.reliability_score || 100}</span>
                            <span className="text-[10px] uppercase tracking-wider">% Reliability</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-8" />

                {/* Stats Grid - Full Width with Padding */}
                <div className="space-y-8 relative z-10 px-8 pt-6 pb-8">
                    {/* Position and Skill Level Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Position */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-primary" /> Position
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {['PG', 'SG', 'SF', 'PF', 'C'].map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setPosition(pos)}
                                        className={`py-3 rounded-xl text-sm font-bold border transition-all duration-300 ${position === pos
                                            ? "bg-white text-black border-white shadow-lg shadow-white/20 scale-105"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
                                            }`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Skill Level */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-primary" /> Skill Level
                            </label>
                            <div className="flex flex-col gap-2">
                                {['Casual', 'Competitive', 'Elite'].map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => setSkillLevel(lvl)}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all flex items-center justify-between group ${skillLevel === lvl
                                            ? "bg-primary/20 text-primary border-primary/50 shadow-lg shadow-primary/10"
                                            : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {lvl === 'Elite' && <Sparkles className="w-4 h-4" />}
                                            {lvl}
                                        </span>
                                        {skillLevel === lvl && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)]" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Height - Full Width */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-white flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-primary" /> Height
                        </label>
                        <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all max-w-md">
                            <div className="flex-1">
                                <label className="text-xs text-zinc-500 mb-1 block">Feet</label>
                                <select
                                    value={heightFt}
                                    onChange={(e) => setHeightFt(Number(e.target.value))}
                                    className="w-full bg-transparent text-white font-bold text-xl focus:outline-none cursor-pointer"
                                >
                                    {[4, 5, 6, 7].map(ft => <option key={ft} value={ft} className="bg-zinc-900">{ft}'</option>)}
                                </select>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex-1">
                                <label className="text-xs text-zinc-500 mb-1 block">Inches</label>
                                <select
                                    value={heightIn}
                                    onChange={(e) => setHeightIn(Number(e.target.value))}
                                    className="w-full bg-transparent text-white font-bold text-xl focus:outline-none cursor-pointer"
                                >
                                    {Array.from({ length: 12 }).map((_, i) => <option key={i} value={i} className="bg-zinc-900">{i}"</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
