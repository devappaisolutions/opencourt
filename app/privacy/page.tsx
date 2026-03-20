import Link from "next/link";
import { Shield } from "lucide-react";
import { Logo4 } from "@/components/logos";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#1F1D1D] text-[#F5EFEA] py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group hover:opacity-80 transition-opacity">
            <Logo4 className="w-8 h-8" />
            <span className="text-2xl font-black italic tracking-tight">OPEN COURT</span>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-black uppercase italic">
              Privacy Policy
            </h1>
          </div>
          <p className="text-[#B8B0A6]">Last updated: March 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 md:space-y-8">

          {/* Introduction */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">Introduction</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              DEVAPP Solutions ("we," "us," or "our") operates OpenCourt, a platform for organizing and joining pickup basketball games. We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <p className="text-[#B8B0A6] leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and services. Please read this policy carefully. By using OpenCourt, you agree to the practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">1. Information We Collect</h2>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Account Information</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              When you create an account using OAuth (Google or Facebook), we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li>Your name (as provided by the OAuth provider)</li>
              <li>Your email address</li>
              <li>Your profile picture</li>
              <li>Unique identifier from the OAuth provider</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Profile Information</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              You may choose to provide additional information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li>Display name (username)</li>
              <li>Position (basketball position preference)</li>
              <li>Height</li>
              <li>Skill level</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Game & Activity Data</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              We collect information about your activity on OpenCourt:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li>Games you join or host</li>
              <li>Check-in status and attendance records</li>
              <li>Reliability score based on attendance history</li>
              <li>Player reviews and ratings</li>
              <li>Game statistics (when provided)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Location Data</h3>
            <p className="text-[#B8B0A6] leading-relaxed">
              If you enable location services, we may collect approximate location data to show you nearby courts and games. Location data is only used to enhance the game discovery experience and is not shared with other users beyond the city/region level.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">2. How We Use Your Information</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6]">
              <li>Provide, maintain, and improve our services</li>
              <li>Authenticate your account and manage sessions</li>
              <li>Match you with appropriate basketball games based on skill level and location</li>
              <li>Calculate and display your reliability score</li>
              <li>Enable communication between players and game hosts</li>
              <li>Send you notifications about games you've joined</li>
              <li>Prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns to improve the user experience (with your consent)</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">3. How We Share Your Information</h2>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Public Profile Information</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              When you join a game, the following information is visible to other players in that game:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li>Display name</li>
              <li>Profile picture</li>
              <li>Position and skill level</li>
              <li>Reliability score</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Third-Party Service Providers</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-6">
              We use third-party services to support our platform:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Vercel:</strong> Hosting and deployment</li>
              <li><strong>Google & Facebook:</strong> OAuth authentication</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Legal Requirements</h3>
            <p className="text-[#B8B0A6] leading-relaxed">
              We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">4. Cookies & Tracking Technologies</h2>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Essential Cookies</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-6">
              We use essential cookies to keep you logged in and maintain your session. These cookies are necessary for the platform to function and cannot be disabled.
            </p>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Analytics Cookies (Optional)</h3>
            <p className="text-[#B8B0A6] leading-relaxed">
              With your consent, we may use analytics cookies (such as Google Analytics) to understand how users interact with OpenCourt and improve the user experience. You can opt out of analytics cookies through our cookie consent banner.
            </p>
          </section>

          {/* Data Retention & Deletion */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">5. Data Retention & Deletion</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              We retain your personal information for as long as your account is active or as needed to provide you services. If you wish to delete your account and personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-4">
              <li>Visit your Profile page and click "Delete Account"</li>
              <li>Or visit our <Link href="/data-deletion" className="text-primary hover:text-primary/80 font-semibold transition-colors">Data Deletion page</Link></li>
              <li>Or email us at <a href="mailto:devappaisolutions@gmail.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">devappaisolutions@gmail.com</a></li>
            </ul>
            <p className="text-[#B8B0A6] leading-relaxed">
              Upon deletion, your profile and personal information will be permanently removed within 30 days. Some anonymized data (such as game statistics) may be retained for analytical purposes.
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">6. Your Privacy Rights</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6]">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information via your Profile page</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
              <li><strong>Opt-Out:</strong> Decline optional cookies and analytics tracking</li>
              <li><strong>Withdrawal of Consent:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p className="text-[#B8B0A6] leading-relaxed mt-4">
              To exercise these rights, contact us at <a href="mailto:devappaisolutions@gmail.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">devappaisolutions@gmail.com</a>.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">7. Children's Privacy</h2>
            <p className="text-[#B8B0A6] leading-relaxed">
              OpenCourt is intended for users aged 13 and older. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has created an account, please contact us immediately at <a href="mailto:devappaisolutions@gmail.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">devappaisolutions@gmail.com</a> and we will delete the account.
            </p>
          </section>

          {/* International Users */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">8. International Users</h2>
            <p className="text-[#B8B0A6] leading-relaxed">
              OpenCourt is based in the Philippines. If you are accessing our services from outside the Philippines, please note that your information may be transferred to, stored, and processed in the Philippines. By using our services, you consent to such transfer and processing.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">9. Changes to This Privacy Policy</h2>
            <p className="text-[#B8B0A6] leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">10. Contact Us</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-[#B8B0A6]">
              <p><strong className="text-[#F5EFEA]">Email:</strong> <a href="mailto:devappaisolutions@gmail.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">devappaisolutions@gmail.com</a></p>
              <p><strong className="text-[#F5EFEA]">Company:</strong> DEVAPP Solutions</p>
              <p><strong className="text-[#F5EFEA]">Platform:</strong> OpenCourt</p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#B8B0A6]">
            <Link href="/" className="hover:text-[#F5EFEA] transition-colors">Home</Link>
            <Link href="/terms" className="hover:text-[#F5EFEA] transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-[#F5EFEA] transition-colors">Support</Link>
            <Link href="/data-deletion" className="hover:text-[#F5EFEA] transition-colors">Data Deletion</Link>
          </div>
          <p className="text-xs text-[#B8B0A6] mt-4">© 2025 DEVAPP Solutions. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
