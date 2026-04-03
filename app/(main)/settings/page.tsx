"use client";

import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock, Shield, CheckCircle2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const supabase = createClient();
    const router = useRouter();
    const [provider, setProvider] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/login"); return; }
            setProvider(user.app_metadata?.provider ?? "email");
            setLoading(false);
        };
        load();
    }, []);

    const validationError = (() => {
        if (!newPassword) return null;
        if (newPassword.length < 8) return "Password must be at least 8 characters.";
        if (confirmPassword && newPassword !== confirmPassword) return "Passwords do not match.";
        return null;
    })();

    const canSubmit = newPassword.length >= 8 && newPassword === confirmPassword && !saving;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSaving(true);
        setError(null);
        setSuccess(false);

        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccess(true);
            setNewPassword("");
            setConfirmPassword("");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isOAuth = provider === "google" || provider === "facebook";

    return (
        <div className="max-w-lg mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-1">
                <span className="text-xs font-bold tracking-widest uppercase text-primary flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Account
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-[#F5EFEA] uppercase italic leading-none font-heading gradient-text">
                    Settings
                </h1>
            </div>

            {/* Change Password Card */}
            <div className="bg-[#2A2827] border border-white/8 rounded-2xl overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-[#F5EFEA] font-bold text-sm">Password</p>
                        <p className="text-[#B8B0A6] text-xs">Change your account password</p>
                    </div>
                </div>

                <div className="p-6">
                    {isOAuth ? (
                        /* OAuth users — no password to change */
                        <div className="flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <p className="text-sm text-amber-300/80 leading-relaxed">
                                Your account is linked to{" "}
                                <strong className="text-amber-300 capitalize">{provider}</strong>.
                                Password management is handled by your provider — you can't set a separate password here.
                            </p>
                        </div>
                    ) : (
                        /* Email users — show change password form */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B8B0A6]/60">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={e => { setNewPassword(e.target.value); setSuccess(false); }}
                                        placeholder="Min. 8 characters"
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 pr-11 text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-zinc-600 input-premium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8B0A6]/50 hover:text-[#B8B0A6] transition-colors"
                                    >
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#B8B0A6]/60">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={e => { setConfirmPassword(e.target.value); setSuccess(false); }}
                                        placeholder="Repeat your new password"
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3.5 pr-11 text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-zinc-600 input-premium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8B0A6]/50 hover:text-[#B8B0A6] transition-colors"
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Inline validation */}
                            {validationError && (
                                <div className="flex items-center gap-2 text-red-400 text-xs">
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                    {validationError}
                                </div>
                            )}

                            {/* Success message */}
                            {success && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    Password updated successfully.
                                </div>
                            )}

                            {/* API error */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="w-full py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-[#E8A966] text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98]"
                            >
                                {saving ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
