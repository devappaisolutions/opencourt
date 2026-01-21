// Centralized type definitions for OpenCourt

export interface Game {
    id: string;
    host_id: string;
    title: string;
    location: string;
    date_time: string;
    format: GameFormat;
    skill_level: SkillLevel;
    cost: string;
    image_gradient: string;
    max_players: number;
    current_players: number;
    description?: string;
    house_rules?: string;
    age_range?: string;
    gender_filter?: string;
    status?: GameStatus;
    cancellation_reason?: string;
    latitude?: number;
    longitude?: number;
    created_at?: string;
    updated_at?: string;
    profiles?: Profile;
}

export interface Profile {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    position?: Position;
    skill_level?: SkillLevel;
    height_ft?: number;
    height_in?: number;
    reliability_score?: number;
    instagram_handle?: string;
    created_at?: string;
    updated_at?: string;
}

export interface RosterEntry {
    id: string;
    game_id: string;
    player_id: string;
    status: RosterStatus;
    joined_at: string;
    profiles?: Profile;
}

export interface UsualCourt {
    id: string;
    host_id: string;
    name: string;
    created_at?: string;
}

export type GameFormat = '3v3' | '4v4' | '5v5';
export type SkillLevel = 'Casual' | 'Competitive' | 'Elite';
export type Position = 'Point Guard' | 'Shooting Guard' | 'Small Forward' | 'Power Forward' | 'Center';
export type PositionAbbr = 'PG' | 'SG' | 'SF' | 'PF' | 'C';
export type GameStatus = 'open' | 'cancelled' | 'completed';
export type RosterStatus = 'joined' | 'waitlist' | 'checked_in' | 'absent';
export type OAuthProvider = 'google' | 'facebook' | 'instagram';

export interface GameCardProps {
    id: string;
    title: string;
    location: string;
    time: string;
    date: string;
    format: GameFormat;
    level: SkillLevel;
    cost: string;
    image: string;
    players: number;
    max_players: number;
    host_id: string;
    status?: GameStatus;
    cancellation_reason?: string;
    isHostPlaying?: boolean;
}

export interface Location {
    lat: number;
    lng: number;
}
