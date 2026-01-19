import { Mail } from "lucide-react";
import Link from "next/link";

export default function DataDeletionPage() {
    return (
        <main className="min-h-screen bg-[#1F1D1D] text-[#F5EFEA] py-16 px-4">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                        <div className="w-8 h-8 rounded-full bg-primary" />
                        <span className="text-2xl font-black italic tracking-tight text-[#F5EFEA] group-hover:text-primary transition-colors">
                            OPEN COURT
                        </span>
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black uppercase italic text-[#F5EFEA] mb-4">
                        Data Deletion <span className="text-primary">Instructions</span>
                    </h1>
                    <p className="text-[#B8B0A6] text-lg">
                        How to request deletion of your OpenCourt account and data
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {/* Introduction */}
                    <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[#F5EFEA] mb-4">Your Privacy Matters</h2>
                        <p className="text-[#B8B0A6] leading-relaxed">
                            At OpenCourt, we respect your privacy and your right to control your personal data.
                            If you wish to delete your account and all associated data, you can do so at any time
                            by following the instructions below.
                        </p>
                    </section>

                    {/* Method 1: In-App Deletion */}
                    <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-black text-lg">1</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#F5EFEA] mb-2">Delete Your Account In-App</h2>
                                <p className="text-[#B8B0A6] leading-relaxed mb-4">
                                    The easiest way to delete your account is directly through the OpenCourt app:
                                </p>
                                <ol className="list-decimal list-inside space-y-2 text-[#B8B0A6]">
                                    <li>Open the OpenCourt app and log in to your account</li>
                                    <li>Navigate to <span className="text-[#F5EFEA] font-semibold">Profile</span></li>
                                    <li>Scroll down and tap <span className="text-[#F5EFEA] font-semibold">Account Settings</span></li>
                                    <li>Select <span className="text-[#F5EFEA] font-semibold">Delete Account</span></li>
                                    <li>Confirm your decision</li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    {/* Method 2: Email Request */}
                    <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-black text-lg">2</span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-[#F5EFEA] mb-2">Request Deletion via Email</h2>
                                <p className="text-[#B8B0A6] leading-relaxed mb-4">
                                    Alternatively, you can send us an email requesting account deletion:
                                </p>

                                <div className="bg-[#1F1D1D] border border-white/5 rounded-xl p-6 space-y-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-[#B8B0A6] mb-2">
                                            Send your request to:
                                        </p>
                                        <a
                                            href="mailto:support@opencourt.app?subject=Data%20Deletion%20Request"
                                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                                        >
                                            <Mail className="w-5 h-5" />
                                            support@opencourt.app
                                        </a>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-[#B8B0A6] mb-2">
                                            Include in your email:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 text-[#B8B0A6] text-sm">
                                            <li>Subject: "Data Deletion Request"</li>
                                            <li>Your registered email address</li>
                                            <li>Your OpenCourt username (if applicable)</li>
                                            <li>Confirmation that you want to delete all your data</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What Gets Deleted */}
                    <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-[#F5EFEA] mb-4">What Data Will Be Deleted?</h2>
                        <p className="text-[#B8B0A6] leading-relaxed mb-4">
                            When you delete your account, we will permanently remove:
                        </p>
                        <ul className="space-y-2 text-[#B8B0A6]">
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">✓</span>
                                <span>Your profile information (name, email, photo)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">✓</span>
                                <span>Game history and statistics</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">✓</span>
                                <span>Reliability scores and ratings</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">✓</span>
                                <span>Any games you've hosted or joined</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">✓</span>
                                <span>All other personal data associated with your account</span>
                            </li>
                        </ul>
                    </section>

                    {/* Timeline */}
                    <section className="bg-primary/10 border border-primary/20 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-[#F5EFEA] mb-4">Processing Timeline</h2>
                        <p className="text-[#B8B0A6] leading-relaxed">
                            <span className="text-primary font-bold">In-app deletions</span> are processed immediately.
                            <span className="text-primary font-bold ml-1">Email requests</span> will be processed within
                            <span className="text-[#F5EFEA] font-bold ml-1">30 days</span> of receipt.
                            You will receive a confirmation email once your data has been deleted.
                        </p>
                    </section>

                    {/* Note */}
                    <section className="bg-[#2A2827] border border-white/5 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-[#F5EFEA] mb-4">Important Note</h2>
                        <p className="text-[#B8B0A6] leading-relaxed">
                            Please note that once your account is deleted, this action <span className="text-[#F5EFEA] font-bold">cannot be undone</span>.
                            All your data will be permanently removed from our systems and cannot be recovered.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="text-center pt-8">
                        <p className="text-[#B8B0A6] mb-4">
                            Have questions about data deletion or privacy?
                        </p>
                        <a
                            href="mailto:support@opencourt.app"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            Contact Support
                        </a>
                    </section>
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-white/5 text-center">
                    <p className="text-[#B8B0A6] text-sm">
                        Last updated: January 2026
                    </p>
                    <div className="flex justify-center gap-6 mt-4">
                        <Link href="/" className="text-[#B8B0A6] text-sm hover:text-[#F5EFEA] transition-colors">
                            Home
                        </Link>
                        <Link href="#" className="text-[#B8B0A6] text-sm hover:text-[#F5EFEA] transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-[#B8B0A6] text-sm hover:text-[#F5EFEA] transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
}
