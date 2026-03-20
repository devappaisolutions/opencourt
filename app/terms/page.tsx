import Link from "next/link";
import { FileText } from "lucide-react";
import { Logo4 } from "@/components/logos";

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-black uppercase italic">
              Terms of Service
            </h1>
          </div>
          <p className="text-[#B8B0A6]">Last updated: March 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 md:space-y-8">

          {/* Introduction */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">Introduction</h2>
            <p className="text-[#B8B0A6] leading-relaxed">
              Welcome to OpenCourt! These Terms of Service ("Terms") govern your access to and use of the OpenCourt platform, operated by DEVAPP Solutions ("we," "us," or "our"). By creating an account or using our services, you agree to be bound by these Terms. If you do not agree, please do not use OpenCourt.
            </p>
          </section>

          {/* Acceptance */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">1. Acceptance of Terms</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              By accessing or using OpenCourt, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy" className="text-primary hover:text-primary/80 font-semibold transition-colors">Privacy Policy</Link>.
            </p>
            <p className="text-[#B8B0A6] leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective when posted. Your continued use of OpenCourt after changes are posted constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Eligibility */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">2. User Accounts & Eligibility</h2>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Age Requirement</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-6">
              You must be at least 13 years old to use OpenCourt. By creating an account, you represent that you meet this age requirement.
            </p>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Account Security</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Accurate Information</h3>
            <p className="text-[#B8B0A6] leading-relaxed">
              You agree to provide accurate, current, and complete information when creating your account and to update it as necessary. Misrepresenting your identity or providing false information may result in account suspension or termination.
            </p>
          </section>

          {/* User Conduct */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">3. User Conduct & Responsibilities</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              When using OpenCourt, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li>Treat all players, hosts, and community members with respect</li>
              <li>Show up to games you've confirmed attendance for, or notify the host in advance if you cannot attend</li>
              <li>Follow the house rules established by game hosts</li>
              <li>Provide honest and constructive reviews and ratings</li>
              <li>Use the platform for its intended purpose: organizing and joining basketball games</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Prohibited Conduct</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6]">
              <li>Harass, threaten, or discriminate against other users</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Spam, advertise, or promote unrelated products or services</li>
              <li>Create multiple accounts to manipulate reliability scores</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Violate any local, state, national, or international law</li>
              <li>Repeatedly fail to show up to confirmed games without notice</li>
            </ul>
          </section>

          {/* Reliability Score */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">4. Reliability Score & No-Show Policy</h2>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">How It Works</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-6">
              Your reliability score reflects your attendance history. Hosts can mark players as "Checked In" or "Absent" for each game. Consistent attendance maintains or improves your score, while no-shows without notice will lower it.
            </p>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Consequences</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              A low reliability score may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li>Reduced visibility in game rosters</li>
              <li>Automatic placement at the end of waitlists</li>
              <li>Hosts may choose to decline players with low scores</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Disputes</h3>
            <p className="text-[#B8B0A6] leading-relaxed">
              If you believe you were incorrectly marked absent, contact us at <a href="mailto:devappaisolutions@gmail.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">devappaisolutions@gmail.com</a> with game details and we will review the case.
            </p>
          </section>

          {/* Hosting Games */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">5. Game Hosting Rules</h2>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Host Responsibilities</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              As a game host, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li>Provide accurate game details (location, time, format, cost)</li>
              <li>Clearly communicate house rules and expectations</li>
              <li>Manage check-ins fairly and accurately</li>
              <li>Honor confirmed rosters and waitlists</li>
              <li>Cancel games with reasonable notice if necessary</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Cancellation Policy</h3>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              If you must cancel a game:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-6">
              <li>Provide at least 3 hours' notice when possible</li>
              <li>Use the "Cancel Run" feature and provide a reason</li>
              <li>Frequent cancellations may affect your hosting privileges</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-[#F5EFEA]">Entry Fees</h3>
            <p className="text-[#B8B0A6] leading-relaxed">
              If you charge an entry fee, you are responsible for collecting payment and ensuring transparency about what the fee covers (e.g., court rental, referees). OpenCourt does not process payments or take liability for fee disputes.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">6. Intellectual Property</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              All content, features, and functionality of OpenCourt (including but not limited to text, graphics, logos, icons, images, and software) are the exclusive property of DEVAPP Solutions and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-[#B8B0A6] leading-relaxed">
              You retain ownership of content you submit (such as reviews or profile information), but you grant us a non-exclusive, worldwide license to use, display, and distribute such content as necessary to operate the platform.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">7. Disclaimer of Warranties</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              OpenCourt is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6]">
              <li>The accuracy, reliability, or availability of the platform</li>
              <li>The quality, safety, or legality of games organized through OpenCourt</li>
              <li>The conduct or reliability of other users</li>
              <li>Uninterrupted or error-free service</li>
            </ul>
            <p className="text-[#B8B0A6] leading-relaxed mt-4">
              We do not guarantee that games will occur as scheduled or that participants will behave appropriately. You participate in games at your own risk.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">8. Limitation of Liability</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              To the fullest extent permitted by law, DEVAPP Solutions and its affiliates, officers, employees, and agents shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-4">
              <li>Any injuries, damages, or losses sustained during basketball games organized through OpenCourt</li>
              <li>Any disputes between users, hosts, or participants</li>
              <li>Lost profits, data, or business opportunities</li>
              <li>Indirect, incidental, consequential, or punitive damages</li>
            </ul>
            <p className="text-[#B8B0A6] leading-relaxed">
              <strong className="text-[#F5EFEA]">IMPORTANT:</strong> Basketball is a physical activity with inherent risks. By participating in games organized through OpenCourt, you acknowledge and assume all risks of injury. We strongly recommend that players obtain appropriate health and liability insurance.
            </p>
          </section>

          {/* Termination */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">9. Termination</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account at any time, with or without notice, for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] mb-4">
              <li>Violations of these Terms</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Repeatedly failing to show up to games</li>
              <li>Harassing or threatening other users</li>
            </ul>
            <p className="text-[#B8B0A6] leading-relaxed">
              You may also delete your account at any time through the Profile page or by contacting us. Upon termination, your right to use OpenCourt will immediately cease.
            </p>
          </section>

          {/* Governing Law */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">10. Governing Law</h2>
            <p className="text-[#B8B0A6] leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any disputes arising from these Terms or your use of OpenCourt shall be subject to the exclusive jurisdiction of the courts of San Pablo City, Laguna, Philippines.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-primary">11. Contact Us</h2>
            <p className="text-[#B8B0A6] leading-relaxed mb-4">
              If you have questions about these Terms or need to report a violation, please contact us:
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
            <Link href="/privacy" className="hover:text-[#F5EFEA] transition-colors">Privacy</Link>
            <Link href="/support" className="hover:text-[#F5EFEA] transition-colors">Support</Link>
            <Link href="/data-deletion" className="hover:text-[#F5EFEA] transition-colors">Data Deletion</Link>
          </div>
          <p className="text-xs text-[#B8B0A6] mt-4">© 2025 DEVAPP Solutions. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
