"use client";

import { createClient } from "@/lib/supabase/client";
import { Facebook, Mail, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleLogin = async (provider: "google" | "facebook") => {
        setIsLoading(true);
        try {
            const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || location.origin;

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
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.refresh();
                router.push("/dashboard");
            } else {
                const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${redirectUrl}/auth/callback`,
                    },
                });
                if (error) throw error;
                setIsVerificationSent(true);
            }
        } catch (error: any) {
            console.error("Auth failed:", error);
            alert(error.message || "Authentication failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#1F1D1D] text-[#F5EFEA] selection:bg-primary/30 overflow-hidden">
            {/* Hero Section with Background */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-court.png"
                        alt="Basketball Court"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1F1D1D]/80 via-[#1F1D1D]/50 to-[#1F1D1D]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1F1D1D] via-transparent to-[#1F1D1D] opacity-60" />
                </div>

                {/* Aurora Overlay */}
                <div className="absolute inset-0 aurora-bg opacity-80 z-[1]" />

                {/* Floating Blobs */}
                <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-primary/15 blur-3xl animate-float pointer-events-none z-[1]" />
                <div className="absolute bottom-1/3 right-1/6 w-56 h-56 rounded-full bg-accent/10 blur-3xl animate-float pointer-events-none z-[1]" style={{ animationDelay: '-3s' }} />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center max-w-md">
                    <div className="space-y-8 animate-slide-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-premium text-primary text-xs font-bold tracking-widest uppercase">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            Elite Pickup Basketball
                        </div>

                        {/* Main Heading */}
                        <h1 className="font-heading text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase italic">
                            <span className="gradient-text">OPEN</span>
                            <br />
                            <span className="text-primary">COURT</span>
                        </h1>

                        {/* Tagline */}
                        <p className="text-[#B8B0A6] font-medium text-sm tracking-wide">
                            Join the elite. Dominate the court.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div
                        className="mt-10 p-8 rounded-3xl glass-card-premium animate-slide-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        <div className="space-y-5">
                            {!showEmail ? (
                                <>
                                    <button
                                        onClick={() => handleLogin("google")}
                                        disabled={isLoading}
                                        className="w-full h-14 rounded-2xl bg-[#F5EFEA] text-[#1F1D1D] font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-white transition-all duration-300 shadow-lg active:scale-[0.98] disabled:opacity-50 shimmer-btn"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Continue with Google
                                    </button>

                                    <button
                                        onClick={() => handleLogin("facebook")}
                                        disabled={isLoading}
                                        className="w-full h-14 rounded-2xl bg-[#1877F2] text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-[#1877F2]/90 transition-all duration-300 shadow-lg active:scale-[0.98] disabled:opacity-50 shimmer-btn"
                                    >
                                        <Facebook className="w-5 h-5" />
                                        Continue with Facebook
                                    </button>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex-1 h-px bg-white/10" />
                                        <span className="text-[10px] font-bold text-[#B8B0A6] tracking-widest uppercase">or</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>

                                    <button
                                        onClick={() => setShowEmail(true)}
                                        disabled={isLoading}
                                        className="w-full h-14 rounded-2xl glass-button text-[#F5EFEA] font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:border-primary/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Continue with Email
                                    </button>
                                </>
                            ) : isVerificationSent ? (
                                <div className="space-y-6 py-4 text-center animate-slide-up">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                                        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-heading font-bold uppercase italic tracking-wide text-emerald-400">Check Your Email</h3>
                                        <p className="text-[#B8B0A6] text-sm">
                                            We sent a verification link to<br />
                                            <span className="text-[#F5EFEA] font-bold">{email}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setIsVerificationSent(false); setShowEmail(false); setMode("login"); }}
                                        className="w-full h-12 rounded-2xl glass-button text-[#B8B0A6] font-bold text-xs tracking-widest uppercase hover:text-[#F5EFEA] transition-all"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleAuth} className="space-y-4 animate-slide-up">
                                    <div className="space-y-3">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full h-14 rounded-2xl bg-[#1F1D1D] border border-white/10 px-5 text-sm font-medium placeholder:text-[#B8B0A6]/50 focus:outline-none focus:border-primary/50 input-premium transition-all"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full h-14 rounded-2xl bg-[#1F1D1D] border border-white/10 px-5 text-sm font-medium placeholder:text-[#B8B0A6]/50 focus:outline-none focus:border-primary/50 input-premium transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-[#E8A966] text-white font-bold text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] disabled:opacity-50 shimmer-btn btn-glow"
                                    >
                                        {isLoading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
                                    </button>

                                    <div className="flex flex-col gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                                            className="text-[#B8B0A6] font-medium text-xs hover:text-[#F5EFEA] transition-all"
                                        >
                                            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowEmail(false)}
                                            className="text-[#B8B0A6]/60 font-medium text-xs hover:text-[#B8B0A6] transition-all"
                                        >
                                            ← Back to options
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <p className="text-[#B8B0A6]/60 text-xs">
                            By continuing, you agree to our{" "}
                            <Link href="#" className="text-[#B8B0A6] hover:text-[#F5EFEA] transition-colors">Terms</Link>
                            {" "}&{" "}
                            <Link href="#" className="text-[#B8B0A6] hover:text-[#F5EFEA] transition-colors">Privacy</Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
