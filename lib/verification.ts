import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function checkVerification() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { isVerified: false, missing: ['auth'] };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) return { isVerified: false, missing: ['profile'] };

    const hasAvatar = !!profile.avatar_url;
    const hasSocial = !!profile.instagram_handle;

    return {
        isVerified: hasAvatar && hasSocial,
        missing: [
            !hasAvatar && 'Photo',
            !hasSocial && 'Social Link'
        ].filter(Boolean) as string[]
    };
}
