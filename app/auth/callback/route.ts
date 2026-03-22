import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { type SerializeOptions } from "cookie";

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
        // Collect cookies to apply to the redirect response
        const cookiesToSet: { name: string; value: string; options: SerializeOptions }[] = [];

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        const cookieHeader = request.headers.get("cookie") || "";
                        return cookieHeader.split("; ").filter(Boolean).map((c) => {
                            const [name, ...rest] = c.split("=");
                            return { name, value: rest.join("=") };
                        });
                    },
                    setAll(cookies) {
                        cookies.forEach(({ name, value, options }) => {
                            cookiesToSet.push({ name, value, options });
                        });
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Check if the user has completed their profile (full_name required)
            const { data: { user } } = await supabase.auth.getUser();

            let redirectUrl = `${redirectBase}${next}`;

            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, username")
                    .eq("id", user.id)
                    .single();

                // If no full_name, send to onboarding
                if (!profile?.full_name) {
                    redirectUrl = `${redirectBase}/onboarding`;
                }
            }

            // Create redirect response and apply all session cookies
            const response = NextResponse.redirect(redirectUrl);
            for (const { name, value, options } of cookiesToSet) {
                response.cookies.set({ name, value, ...options });
            }
            return response;
        }

        console.error("Auth callback error:", error.message, error);
        const errorParam = encodeURIComponent(error.message || "Code exchange failed");
        return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${errorParam}`);
    }

    return NextResponse.redirect(`${redirectBase}/auth/auth-code-error?error=${encodeURIComponent("No authorization code provided")}`);
}
