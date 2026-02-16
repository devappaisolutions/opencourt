"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="glass-card-premium w-full max-w-md p-8 rounded-3xl space-y-6 relative z-10 text-center animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-heading font-bold text-[#F5EFEA]">
                    Authentication Error
                </h1>
                <p className="text-[#B8B0A6] text-sm">
                    Something went wrong during sign in. This can happen if the login link expired or was already used.
                </p>
                {error && (
                    <p className="text-red-400/80 text-xs mt-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                        {error}
                    </p>
                )}
            </div>

            <Link
                href="/login"
                className="inline-flex items-center justify-center w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-[#E8A966] text-white font-bold text-xs tracking-widest uppercase transition-all shimmer-btn btn-glow"
            >
                Try Again
            </Link>
        </div>
    );
}

export default function AuthCodeErrorPage() {
    return (
        <main className="min-h-screen bg-[#1F1D1D] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Aurora Background */}
            <div className="absolute inset-0 aurora-bg pointer-events-none" />

            <Suspense fallback={
                <div className="glass-card-premium w-full max-w-md p-8 rounded-3xl space-y-6 relative z-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-[#F5EFEA]">Authentication Error</h1>
                </div>
            }>
                <ErrorContent />
            </Suspense>
        </main>
    );
}
