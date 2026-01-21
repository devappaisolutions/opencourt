// Centralized constants for OpenCourt

import type { GameFormat, SkillLevel, Position, PositionAbbr } from './types';

// Pagination
export const GAMES_PER_PAGE_MOBILE = 5;
export const GAMES_PER_PAGE_DESKTOP = 8;

// Game Formats
export const GAME_FORMATS: GameFormat[] = ['3v3', '4v4', '5v5'];

// Skill Levels
export const SKILL_LEVELS: SkillLevel[] = ['Casual', 'Competitive', 'Elite'];

// Positions
export const POSITIONS: Position[] = [
    'Point Guard',
    'Shooting Guard',
    'Small Forward',
    'Power Forward',
    'Center'
];

export const POSITION_ABBR: PositionAbbr[] = ['PG', 'SG', 'SF', 'PF', 'C'];

// Position Mapping
export const POSITION_MAP: Record<PositionAbbr, Position> = {
    'PG': 'Point Guard',
    'SG': 'Shooting Guard',
    'SF': 'Small Forward',
    'PF': 'Power Forward',
    'C': 'Center'
};

export const REVERSE_POSITION_MAP: Record<Position, PositionAbbr> = {
    'Point Guard': 'PG',
    'Shooting Guard': 'SG',
    'Small Forward': 'SF',
    'Power Forward': 'PF',
    'Center': 'C'
};

// Max Players by Format
export const MAX_PLAYERS_BY_FORMAT: Record<GameFormat, number> = {
    '3v3': 6,
    '4v4': 10,
    '5v5': 15
};

// Color Gradients for Game Cards
export const GAME_GRADIENTS = [
    "bg-gradient-to-br from-blue-900 to-slate-900",
    "bg-gradient-to-br from-orange-900 to-red-900",
    "bg-gradient-to-br from-purple-900 to-indigo-900",
    "bg-gradient-to-br from-emerald-900 to-teal-900"
];

// Default Location (San Pablo, Philippines)
export const DEFAULT_LOCATION = {
    lat: 14.0693,
    lng: 121.3265
};

// Animation Delays
export const CARD_ANIMATION_DELAY = 0.08; // seconds
export const MAX_ANIMATION_ITEMS = 8;

// Date/Time Formats
export const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
};

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
};

// Age Ranges
export const AGE_RANGES = ['All Ages', '18+', '21+', 'Under 18'];

// Gender Filters
export const GENDER_FILTERS = ['Mixed', 'Mens', 'Womens'];

// Default Values
export const DEFAULT_SKILL_LEVEL: SkillLevel = 'Casual';
export const DEFAULT_POSITION: PositionAbbr = 'PG';
export const DEFAULT_HEIGHT_FT = 5;
export const DEFAULT_HEIGHT_IN = 9;
export const DEFAULT_RELIABILITY_SCORE = 100;
