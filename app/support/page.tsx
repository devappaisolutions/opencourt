import Link from "next/link";
import { HeadphonesIcon, Mail, Clock } from "lucide-react";
import { Logo4 } from "@/components/logos";

export default function SupportPage() {
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
            <HeadphonesIcon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-black uppercase italic">
              Support
            </h1>
          </div>
          <p className="text-[#B8B0A6]">We're here to help you get the most out of OpenCourt</p>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[#F5EFEA]">Get In Touch</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5EFEA] mb-1">Email Support</h3>
                <a
                  href="mailto:devappaisolutions@gmail.com"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  devappaisolutions@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F5EFEA] mb-1">Response Time</h3>
                <p className="text-[#B8B0A6]">We typically respond within 24-48 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6 md:space-y-8">

          {/* Getting Started */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-primary">Getting Started</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">How do I join a game?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  Browse available games on the Dashboard, then click the "JOIN RUN" button on any game card. If the host has set house rules, you'll be asked to agree before joining. Once confirmed, you'll see a "CONFIRMED" badge on the game.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">What is a reliability score?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  Your reliability score reflects your attendance history. It starts at 100% and changes based on whether you show up to games you've joined. Hosts mark players as "Checked In" or "Absent" after each game. Consistent attendance maintains your score, while no-shows lower it.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">How does the waitlist work?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  When a game reaches max capacity, you can join the waitlist. If a spot opens up (someone leaves or the host increases capacity), waitlisted players are automatically promoted to the main roster in the order they joined the waitlist.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">Can I leave a game after joining?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  Yes, you can leave a game from the game detail page. However, leaving close to game time without notifying the host may affect your reliability score. It's courteous to inform the host if you can't make it.
                </p>
              </div>
            </div>
          </section>

          {/* Hosting Games */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-primary">Hosting Games</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">How do I create a game?</h3>
                <p className="text-[#B8B0A6] leading-relaxed mb-3">
                  Click the ➕ icon in the sidebar or the "HOST A RUN" button on the dashboard. You'll go through a 5-step wizard:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-[#B8B0A6] ml-4">
                  <li>Location & Schedule (court, date, time)</li>
                  <li>Format (game type, max players, skill level)</li>
                  <li>Details (description, house rules)</li>
                  <li>Filters (gender, age restrictions)</li>
                  <li>Confirm & Publish (review and set entry fee)</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">How does the QR check-in system work?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  As a host, click "SCAN MODE" on the game detail page. Players show their QR code (from "SHOW CHECK-IN QR" button), and you scan it with your camera. This automatically marks them as checked in. You can also manually mark attendance using the checkmark/X buttons next to each player.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">Can I edit or cancel a game after publishing?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  Currently, you cannot edit published games, but you can cancel them using the "CANCEL RUN" button on the game detail page. You'll need to provide a reason, which will be visible to all players who joined. Try to give at least 3 hours' notice when canceling.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">What is the Team Generator?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  The Team Generator is a host-only feature that automatically splits your confirmed roster into 2 balanced teams based on skill level and position. It's available on the game detail page once you have players confirmed.
                </p>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-primary">Account Management</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">How do I update my profile?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  Click the 👤 Profile icon in the sidebar. You can edit your full name, display name, position, height, skill level, and profile picture. Click "Save Changes" when done.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">How do I delete my account?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  Visit the <Link href="/data-deletion" className="text-primary hover:text-primary/80 font-semibold transition-colors">Data Deletion page</Link> for instructions. You can delete your account directly from your Profile page, or email us at <a href="mailto:devappaisolutions@gmail.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">devappaisolutions@gmail.com</a>. All your data will be permanently removed within 30 days.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">Can I change my email address?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  Currently, email addresses are tied to your OAuth provider (Google or Facebook). To change your email, you'll need to update it through your Google or Facebook account settings.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">How do I manage cookie preferences?</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  You can review our <Link href="/privacy" className="text-primary hover:text-primary/80 font-semibold transition-colors">Privacy Policy</Link> to learn about cookies. If you want to change your cookie consent, clear your browser's local storage for OpenCourt and the cookie banner will reappear on your next visit.
                </p>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-primary">Troubleshooting</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">I can't check in to a game</h3>
                <p className="text-[#B8B0A6] leading-relaxed mb-3">
                  Make sure you've joined the game first. Check-in is only available on game day and must be done by the host. Show your QR code to the host, or ask them to manually mark you as checked in.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">I'm not receiving email notifications</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  Check your spam/junk folder. Add devappaisolutions@gmail.com to your contacts to ensure emails reach your inbox. If the problem persists, contact us at <a href="mailto:devappaisolutions@gmail.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">devappaisolutions@gmail.com</a>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">Login with Google/Facebook isn't working</h3>
                <p className="text-[#B8B0A6] leading-relaxed mb-3">
                  Try these steps:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] ml-4">
                  <li>Clear your browser cache and cookies</li>
                  <li>Make sure pop-ups are enabled for OpenCourt</li>
                  <li>Try a different browser or incognito mode</li>
                  <li>Check that you're logged into Google/Facebook in your browser</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">My reliability score is incorrect</h3>
                <p className="text-[#B8B0A6] leading-relaxed">
                  If you believe you were incorrectly marked absent, email us at <a href="mailto:devappaisolutions@gmail.com" className="text-primary hover:text-primary/80 font-semibold transition-colors">devappaisolutions@gmail.com</a> with the game details (date, host, location). We'll review the case and adjust your score if necessary.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5EFEA]">The app isn't loading or is showing errors</h3>
                <p className="text-[#B8B0A6] leading-relaxed mb-3">
                  Try these troubleshooting steps:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#B8B0A6] ml-4">
                  <li>Refresh the page (Ctrl+R or Cmd+R)</li>
                  <li>Clear your browser cache</li>
                  <li>Try a different browser</li>
                  <li>Check your internet connection</li>
                  <li>If the issue persists, contact support with details about the error</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-primary">Additional Resources</h2>

            <div className="space-y-4">
              <Link
                href="/data-deletion"
                className="block p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group"
              >
                <h3 className="text-lg font-semibold mb-1 text-[#F5EFEA] group-hover:text-primary transition-colors">
                  Data Deletion Guide
                </h3>
                <p className="text-sm text-[#B8B0A6]">
                  Learn how to delete your account and personal data
                </p>
              </Link>

              <Link
                href="/privacy"
                className="block p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group"
              >
                <h3 className="text-lg font-semibold mb-1 text-[#F5EFEA] group-hover:text-primary transition-colors">
                  Privacy Policy
                </h3>
                <p className="text-sm text-[#B8B0A6]">
                  Understand how we collect, use, and protect your data
                </p>
              </Link>

              <Link
                href="/terms"
                className="block p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group"
              >
                <h3 className="text-lg font-semibold mb-1 text-[#F5EFEA] group-hover:text-primary transition-colors">
                  Terms of Service
                </h3>
                <p className="text-sm text-[#B8B0A6]">
                  Read our terms and community guidelines
                </p>
              </Link>
            </div>
          </section>

          {/* Still Need Help */}
          <section className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#F5EFEA]">Still Need Help?</h2>
            <p className="text-[#B8B0A6] mb-6 max-w-xl mx-auto">
              Can't find what you're looking for? Our support team is here to assist you with any questions or issues.
            </p>
            <a
              href="mailto:devappaisolutions@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-bold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all btn-glow"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#B8B0A6]">
            <Link href="/" className="hover:text-[#F5EFEA] transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-[#F5EFEA] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#F5EFEA] transition-colors">Terms</Link>
            <Link href="/data-deletion" className="hover:text-[#F5EFEA] transition-colors">Data Deletion</Link>
          </div>
          <p className="text-xs text-[#B8B0A6] mt-4">© 2025 DEVAPP Solutions. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
