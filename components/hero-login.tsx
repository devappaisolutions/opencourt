"use client";

import { createClient } from "@/lib/supabase/client";
import { Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleLogin = async (provider: "google" | "facebook" | "instagram") => {
        setIsLoading(true);
        try {
            const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
            console.log('🔍 OAuth Debug Info:');
            console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
            console.log('window.location.origin:', window.location.origin);
            console.log('Final redirectUrl:', redirectUrl);
            console.log('Full redirect path:', `${redirectUrl}/auth/callback`);

            await supabase.auth.signInWithOAuth({
                provider: provider as any,
                options: {
                    redirectTo: `${redirectUrl}/auth/callback`,
                },
            });
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setIsLoading(true);
        try {
            if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.refresh();
                router.push("/dashboard");
            } else {
                const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
                const { error } = await supabase.auth.signUp({
                    email, password,
                    options: { emailRedirectTo: `${redirectUrl}/auth/callback` },
                });
                if (error) throw error;
                setIsVerificationSent(true);
            }
        } catch (error: any) {
            console.error("Auth failed:", error);
            alert(error.message || "Authentication failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto pt-4 animate-slide-up min-h-[380px]" style={{ animationDelay: '0.1s' }}>
            {!showEmail ? (
                <>
                    <div className="flex flex-col items-center justify-center gap-3 w-full">
                        {/* Google */}
                        <button
                            onClick={() => handleLogin("google")}
                            disabled={isLoading}
                            className="group w-full h-14 rounded-2xl bg-[#F5EFEA] text-[#1F1D1D] font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => handleLogin("facebook")}
                            disabled={isLoading}
                            className="group w-full h-14 rounded-2xl bg-[#1877F2] text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-[#1877F2]/90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Continue with Facebook
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 w-full py-1">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-[10px] font-bold text-[#B8B0A6] tracking-widest uppercase">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Email */}
                    <button
                        onClick={() => setShowEmail(true)}
                        disabled={isLoading}
                        className="group w-full h-14 rounded-2xl bg-[#2A2827] text-[#F5EFEA] font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-3 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.98]"
                    >
                        <Mail className="w-5 h-5" />
                        Continue with Email
                    </button>
                </>
            ) : isVerificationSent ? (
                <div className="w-full space-y-5 py-6 px-6 rounded-2xl bg-[#2A2827] border border-white/10 text-center">
                    <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-primary">Verify Your Access</h3>
                        <p className="text-[#B8B0A6] text-xs font-medium">
                            We've sent an access link to:<br />
                            <span className="text-[#F5EFEA]">{email}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => { setIsVerificationSent(false); setShowEmail(false); setMode("login"); }}
                        className="w-full h-11 rounded-xl bg-[#1F1D1D] text-[#B8B0A6] font-bold text-[10px] tracking-widest uppercase border border-white/5 hover:text-[#F5EFEA] transition-all"
                    >
                        Back to entry
                    </button>
                </div>
            ) : (
                <form onSubmit={handleAuth} className="w-full space-y-4">
                    <div className="space-y-3">
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 rounded-xl bg-[#2A2827] border border-white/10 px-5 text-xs font-bold tracking-widest uppercase text-[#F5EFEA] placeholder:text-[#B8B0A6]/40 focus:outline-none focus:border-primary/50 transition-all input-premium"
                        />
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-12 rounded-xl bg-[#2A2827] border border-white/10 px-5 text-xs font-bold tracking-widest uppercase text-[#F5EFEA] placeholder:text-[#B8B0A6]/40 focus:outline-none focus:border-primary/50 transition-all input-premium"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowEmail(false)}
                            className="flex-1 h-12 rounded-xl bg-[#1F1D1D] text-[#B8B0A6] font-bold text-[10px] tracking-widest uppercase border border-white/5 hover:text-[#F5EFEA] transition-all"
                        >
                            BACK
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] h-12 rounded-xl bg-primary text-white font-bold text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shimmer-btn btn-glow"
                        >
                            {isLoading ? "LOADING..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        className="w-full text-center text-[#B8B0A6] font-bold text-[10px] tracking-widest uppercase hover:text-[#F5EFEA] transition-colors pt-1"
                    >
                        {mode === "login" ? (
                            <span>New here? <span className="text-primary">Create account</span></span>
                        ) : (
                            <span>Already a baller? <span className="text-primary">Sign in</span></span>
                        )}
                    </button>
                </form>
            )
            }

            <p className="text-[10px] font-bold tracking-widest uppercase text-[#B8B0A6]/50 text-center">
                By entering, you agree to our Terms & Privacy
            </p>
        </div >
    );
}
