import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    const forwardedHost = request.headers.get("x-forwarded-host");

    let redirectBase: string;
    if (forwardedHost) {
        redirectBase = `https://${forwardedHost}`;
    } else {
        redirectBase = origin;
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Check if the user has completed their profile (full_name required)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, username")
                    .eq("id", user.id)
                    .single();

                // If no full_name, send to onboarding
                if (!profile?.full_name) {
                    return NextResponse.redirect(`${redirectBase}/onboarding`);
                }
            }
            return NextResponse.redirect(`${redirectBase}${next}`);
        }
        console.error("Auth callback error:", error.message, error);
        const errorParam = encodeURIComponent(error.message || "Code exchange failed");
        return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${errorParam}`);
    }

    return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${encodeURIComponent("No authorization code provided")}`);
}
