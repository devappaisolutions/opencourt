"use client";

import { Users } from "lucide-react";
import Image from "next/image";

interface Player {
    id: string;
    full_name: string | null;
    position: string | null;
    height_ft: number | null;
    height_in: number | null;
    skill_level: string | null;
    reliability_score: number;
    avatar_url?: string | null;
}

interface Team {
    team_number: number;
    players: Player[];
    avg_skill: number;
}

interface TeamDisplayProps {
    teams: Team[];
}

export function TeamDisplay({ teams }: TeamDisplayProps) {
    const team1 = teams.find((t) => t.team_number === 1);
    const team2 = teams.find((t) => t.team_number === 2);

    if (!team1 || !team2) return null;

    const getSkillColor = (skill: string | null) => {
        switch (skill) {
            case "Elite":
                return "text-amber-400";
            case "Competitive":
                return "text-primary";
            case "Casual":
                return "text-blue-400";
            default:
                return "text-zinc-400";
        }
    };

    const TeamCard = ({ team, color }: { team: Team; color: string }) => (
        <div className="flex-1 space-y-4">
            <div className={`glass-card-premium p-4 rounded-2xl border-2 ${color}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color.replace('border', 'bg')}`} />
                        <h3 className="font-bold text-white uppercase tracking-wider font-heading">
                            Team {team.team_number}
                        </h3>
                    </div>
                    <div className="text-xs text-zinc-400">
                        Avg Skill: {team.avg_skill.toFixed(1)}
                    </div>
                </div>

                <div className="space-y-2">
                    {team.players.map((player) => (
                        <div
                            key={player.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5 hover-lift"
                        >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                                {player.avatar_url ? (
                                    <Image
                                        src={player.avatar_url}
                                        alt={player.full_name || "Player"}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Users className="w-5 h-5 text-zinc-600" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">
                                    {player.full_name || "Unknown Player"}
                                </p>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-zinc-500">{player.position || "No Position"}</span>
                                    {(player.height_ft || player.height_in) && (
                                        <>
                                            <span className="text-zinc-700">•</span>
                                            <span className="text-zinc-500">
                                                {player.height_ft || 0}'{player.height_in || 0}"
                                            </span>
                                        </>
                                    )}
                                    <span className="text-zinc-700">•</span>
                                    <span className={getSkillColor(player.skill_level)}>
                                        {player.skill_level || "No Level"}
                                    </span>
                                </div>
                            </div>

                            <div className="text-xs font-bold text-zinc-500">
                                {player.reliability_score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider font-heading">
                    Team Matchups
                </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <TeamCard team={team1} color="border-blue-500/50" />
                <div className="flex items-center justify-center">
                    <div className="text-2xl font-bold text-zinc-600">VS</div>
                </div>
                <TeamCard team={team2} color="border-red-500/50" />
            </div>
        </div>
    );
}
