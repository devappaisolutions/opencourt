import { createClient } from "@/lib/supabase/server";
import { Shield, Trophy, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HeroLogin } from "@/components/hero-login";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#1F1D1D] text-[#F5EFEA] selection:bg-primary/30 overflow-hidden">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-court.png"
            alt="Basketball Court"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F1D1D]/70 via-[#1F1D1D]/30 to-[#1F1D1D]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F1D1D] via-transparent to-[#1F1D1D] opacity-50" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center space-y-8 max-w-4xl">
          <div className="space-y-6 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Now in Private Beta
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none uppercase italic">
              <span className="text-[#F5EFEA]">
                OPEN
              </span>
              <br />
              <span className="text-primary">
                COURT
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-[#B8B0A6] font-medium max-w-2xl mx-auto leading-relaxed">
              Experience the <span className="text-[#F5EFEA] font-bold">elite level</span> of pickup basketball.
              <br className="hidden md:block" />
              Host runs, join the squad, and <span className="text-primary font-bold">dominate the court</span>.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 pt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <HeroLogin />

            <div className="pt-2">
              <Link
                href="/host"
                className="text-[#B8B0A6] font-bold text-xs tracking-widest uppercase hover:text-[#F5EFEA] transition-colors border-b border-transparent hover:border-primary/50 pb-1"
              >
                Or Host a Game →
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - positioned outside content container */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-40 flex flex-col items-center gap-2 z-10">
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#B8B0A6]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-28 container mx-auto px-4 relative">
        <div className="relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Why OpenCourt</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight text-[#F5EFEA]">
              Built for <span className="text-primary">Ballers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-7 h-7 text-[#1F1D1D]" />,
                title: "Reliability First",
                desc: "Built-in reputation system ensures quality runs. Players are ranked by their check-in consistency.",
                light: true
              },
              {
                icon: <Users className="w-7 h-7 text-primary" />,
                title: "Smart Waitlists",
                desc: "No more crowded courts. Our intelligent waitlist system manages rosters automatically.",
                light: false
              },
              {
                icon: <Trophy className="w-7 h-7 text-[#1F1D1D]" />,
                title: "Level Up",
                desc: "From Casual to Elite. Track your stats, build your player card, and find runs that match your skill.",
                light: true
              }
            ].map((feature, i) => (
              <div
                key={i}
                className={`group p-8 rounded-2xl hover-lift card-shine transition-all duration-300 opacity-0 animate-card-entrance ${feature.light
                  ? 'bg-[#F5EFEA] text-[#1F1D1D] border border-[#E8E0D8]'
                  : 'bg-[#2A2827] text-[#F5EFEA] border border-white/5'
                  }`}
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
              >
                {/* Icon */}
                <div className={`mb-5 w-14 h-14 rounded-xl flex items-center justify-center ${feature.light ? 'bg-primary' : 'bg-primary/10'
                  }`}>
                  {feature.icon}
                </div>

                <h3 className={`text-xl font-bold mb-3 ${feature.light ? 'text-[#1F1D1D]' : 'text-[#F5EFEA]'}`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed text-sm ${feature.light ? 'text-[#5A544C]' : 'text-[#B8B0A6]'}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/5 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Active Ballers" },
              { value: "150+", label: "Weekly Runs" },
              { value: "3", label: "Cities Live" },
              { value: "98%", label: "Show-up Rate" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2 group">
                <div className="text-4xl md:text-5xl font-black text-[#F5EFEA] group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#B8B0A6]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 border-t border-white/5 relative">
        <div className="container mx-auto px-4 text-center space-y-10">
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-[#B8B0A6]">Legendary Courts</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic text-[#F5EFEA]">
              Join the <span className="text-primary">Squad</span>
            </h2>
            <p className="text-[#B8B0A6] max-w-xl mx-auto">Available in NYC, LA, and Manila. Ready to run?</p>
          </div>

          <div className="flex flex-wrap justify-center gap-10 opacity-50 hover:opacity-100 transition-all duration-500">
            {["RUCKER PARK", "DYCKMAN", "VENICE BEACH", "TENEMENT"].map((court, i) => (
              <div
                key={i}
                className="font-black text-xl md:text-2xl tracking-tight italic text-[#F5EFEA] hover:text-primary hover:scale-105 transition-all cursor-pointer"
              >
                {court}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-bold text-sm tracking-widest uppercase shimmer-btn btn-glow transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              Start Playing Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary" />
            <span className="text-xl font-black italic tracking-tight text-[#F5EFEA]">OPEN COURT</span>
          </div>
          <div className="flex gap-8 text-sm text-[#B8B0A6] font-medium">
            <Link href="#" className="hover:text-[#F5EFEA] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[#F5EFEA] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#F5EFEA] transition-colors">Support</Link>
            <Link href="#" className="hover:text-[#F5EFEA] transition-colors">Instagram</Link>
          </div>
          <div className="text-sm text-[#B8B0A6]/60">
            © 2026 OpenCourt Labs
          </div>
        </div>
      </footer>
    </main>
  );
}
