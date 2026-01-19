import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            // Use NEXT_PUBLIC_SITE_URL if available, otherwise fall back to x-forwarded-host or origin
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
            const forwardedHost = request.headers.get("x-forwarded-host");
            const { origin } = new URL(request.url);

            let redirectUrl: string;
            if (siteUrl) {
                redirectUrl = siteUrl;
            } else if (forwardedHost) {
                redirectUrl = `https://${forwardedHost}`;
            } else {
                redirectUrl = origin;
            }

            return NextResponse.redirect(`${redirectUrl}${next}`);
        }
    }

    // return the user to an error page with instructions
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const { origin } = new URL(request.url);
    const redirectUrl = siteUrl || origin;
    return NextResponse.redirect(`${redirectUrl}/auth/auth-code-error`);
}
