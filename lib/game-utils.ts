// Utility functions for game-related operations

import type { Game, GameCardProps, Profile } from './types';
import { TIME_FORMAT_OPTIONS, DATE_FORMAT_OPTIONS, GAME_GRADIENTS } from './constants';

/**
 * Format a date string to display time
 */
export function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', TIME_FORMAT_OPTIONS);
}

/**
 * Format a date string to display date
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
}

/**
 * Calculate distance between two coordinates using simplified formula
 * For more accurate results, use Haversine formula
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
}

/**
 * Get a random gradient for game cards
 */
export function getRandomGradient(): string {
    return GAME_GRADIENTS[Math.floor(Math.random() * GAME_GRADIENTS.length)];
}

/**
 * Resolve avatar URL from various OAuth sources
 */
export function resolveAvatarUrl(user: any, profile?: Profile): string | null {
    // Check OAuth sources first
    const oauthAvatar = user?.user_metadata?.avatar_url ||
        user?.user_metadata?.picture ||
        user?.identities?.[0]?.identity_data?.avatar_url ||
        user?.identities?.[0]?.identity_data?.picture;

    if (oauthAvatar) {
        // If it's a Facebook avatar, request higher resolution
        if (oauthAvatar.includes('facebook')) {
            if (!oauthAvatar.includes('?')) {
                return `${oauthAvatar}?width=500&height=500`;
            } else if (!oauthAvatar.includes('width=') && !oauthAvatar.includes('type=')) {
                return `${oauthAvatar}&width=500&height=500`;
            }
        }
        return oauthAvatar;
    }

    // Fallback to profile avatar
    return profile?.avatar_url || null;
}

/**
 * Transform a Game object to GameCardProps
 */
export function transformGameToCardProps(game: Game): GameCardProps {
    return {
        ...game,
        image: game.image_gradient || "bg-gradient-to-br from-[#2A2827] to-[#1F1D1D]",
        players: game.current_players || 0,
        max_players: game.max_players || 10,
        time: formatTime(game.date_time),
        date: formatDate(game.date_time),
        level: game.skill_level,
        status: game.status || 'open',
        cancellation_reason: game.cancellation_reason || undefined,
        isHostPlaying: false
    };
}

/**
 * Check if a game is today
 */
export function isToday(dateString: string): boolean {
    const today = new Date();
    const gameDate = new Date(dateString);
    return gameDate.getDate() === today.getDate() &&
        gameDate.getMonth() === today.getMonth() &&
        gameDate.getFullYear() === today.getFullYear();
}

/**
 * Get display name from user/profile
 */
export function getDisplayName(user: any, profile?: Profile): string {
    return profile?.full_name ||
        profile?.username ||
        user?.email?.split('@')[0] ||
        'Player';
}

/**
 * Generate consistent hash-based offset for map markers
 */
export function generateMapOffset(id: string): { lat: number; lng: number } {
    const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };

    const hash = hashString(id);
    const latOffset = ((hash % 1000) / 1000 - 0.5) * 0.05;
    const lngOffset = (((hash >> 10) % 1000) / 1000 - 0.5) * 0.05;

    return { lat: latOffset, lng: lngOffset };
}
