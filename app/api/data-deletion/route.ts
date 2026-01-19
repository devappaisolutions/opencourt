import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Facebook Data Deletion Callback
 * This endpoint handles data deletion requests from Facebook
 * when users delete their Facebook account or revoke app permissions
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { signed_request } = body;

        if (!signed_request) {
            return NextResponse.json(
                { error: "Missing signed_request parameter" },
                { status: 400 }
            );
        }

        // Parse the signed request from Facebook
        // Format: encoded_signature.payload
        const [encodedSig, payload] = signed_request.split(".");

        if (!payload) {
            return NextResponse.json(
                { error: "Invalid signed_request format" },
                { status: 400 }
            );
        }

        // Decode the payload
        const decodedPayload = JSON.parse(
            Buffer.from(payload, "base64").toString("utf-8")
        );

        const userId = decodedPayload.user_id;

        if (!userId) {
            return NextResponse.json(
                { error: "Missing user_id in request" },
                { status: 400 }
            );
        }

        // TODO: Implement actual data deletion logic
        // This should:
        // 1. Find the user by their Facebook ID
        // 2. Delete all associated data (games, rosters, reviews, etc.)
        // 3. Delete the user profile
        // 4. Log the deletion request for compliance

        const supabase = await createClient();

        // Example: Find user by Facebook provider ID
        // const { data: user } = await supabase
        //   .from("profiles")
        //   .select("id")
        //   .eq("provider_id", userId)
        //   .single();

        // if (user) {
        //   // Delete user data
        //   await supabase.from("profiles").delete().eq("id", user.id);
        //   // Delete other associated data...
        // }

        // Generate a confirmation code for Facebook
        const confirmationCode = `${userId}_${Date.now()}`;
        const statusUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/data-deletion/status?code=${confirmationCode}`;

        // Return the required response format for Facebook
        return NextResponse.json({
            url: statusUrl,
            confirmation_code: confirmationCode,
        });
    } catch (error) {
        console.error("Data deletion callback error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * GET endpoint for testing
 */
export async function GET() {
    return NextResponse.json({
        message: "Facebook Data Deletion Callback Endpoint",
        method: "POST",
        description: "This endpoint handles data deletion requests from Facebook",
    });
}
