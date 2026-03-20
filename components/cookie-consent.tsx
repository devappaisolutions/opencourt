"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, ChevronDown, ChevronUp } from "lucide-react";

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  timestamp: number;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if consent already given
    const consent = localStorage.getItem('opencourt_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences: ConsentPreferences = {
      essential: true,
      analytics: true,
      timestamp: Date.now()
    };
    localStorage.setItem('opencourt_cookie_consent', JSON.stringify(preferences));
    setShowBanner(false);
  };

  const handleEssentialOnly = () => {
    const preferences: ConsentPreferences = {
      essential: true,
      analytics: false,
      timestamp: Date.now()
    };
    localStorage.setItem('opencourt_cookie_consent', JSON.stringify(preferences));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card-premium rounded-2xl p-6 shadow-2xl border-t border-white/20">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F5EFEA]">Cookie Preferences</h3>
                <p className="text-xs text-[#B8B0A6]">We value your privacy</p>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Close banner"
            >
              <X className="w-4 h-4 text-[#B8B0A6]" />
            </button>
          </div>

          {/* Message */}
          <p className="text-sm text-[#B8B0A6] leading-relaxed mb-4">
            We use essential cookies to keep you logged in and ensure the app works properly.
            We may also use analytics cookies to improve your experience.{" "}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-primary hover:text-primary/80 font-semibold transition-colors inline-flex items-center gap-1"
            >
              {showDetails ? "Show less" : "Learn more"}
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </p>

          {/* Detailed Categories (expandable) */}
          {showDetails && (
            <div className="mb-4 space-y-3 p-4 rounded-xl bg-[#1F1D1D] border border-white/5 animate-in slide-in-from-top duration-300">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5EFEA]">Essential Cookies</h4>
                    <p className="text-xs text-[#B8B0A6]">Required for authentication and core functionality. These cookies cannot be disabled.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Always On</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#F5EFEA]">Analytics Cookies</h4>
                    <p className="text-xs text-[#B8B0A6]">Help us understand how you use the app to improve your experience. Optional.</p>
                  </div>
                  <span className="text-xs font-bold text-[#B8B0A6] uppercase tracking-wider">Optional</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs tracking-widest uppercase hover:bg-primary/90 transition-all btn-glow"
            >
              Accept All
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 px-6 py-3 rounded-xl glass-button text-[#F5EFEA] font-bold text-xs tracking-widest uppercase hover:border-primary/30 transition-all"
            >
              Essential Only
            </button>
          </div>

          {/* Privacy Link */}
          <p className="text-center mt-4 text-xs text-[#B8B0A6]">
            Read our{" "}
            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors font-semibold">
              Privacy Policy
            </Link>
            {" "}to learn more about how we protect your data.
          </p>
        </div>
      </div>
    </div>
  );
}
