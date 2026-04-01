"use client";

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import Image from 'next/image';

export interface DraggablePlayer {
    id: string;
    full_name: string | null;
    position: string | null;
    height_ft: number | null;
    height_in: number | null;
    skill_level: string | null;
    reliability_score: number;
    avatar_url?: string | null;
    ovr: number;
}

export interface LocalTeamState {
    pool: DraggablePlayer[];
    team1: DraggablePlayer[];
    team2: DraggablePlayer[];
}

type ZoneId = 'pool' | 'team1' | 'team2';

interface TeamDndBoardProps {
    teamState: LocalTeamState;
    onMove: (playerId: string, destination: ZoneId) => void;
}

function getOVRColor(ovr: number): string {
    if (ovr >= 80) return 'text-amber-400 bg-amber-400/15 border-amber-400/30';
    if (ovr >= 60) return 'text-primary bg-primary/15 border-primary/30';
    if (ovr >= 40) return 'text-blue-400 bg-blue-400/15 border-blue-400/30';
    return 'text-zinc-400 bg-zinc-400/15 border-zinc-400/30';
}

function PlayerCard({ player, isDragging = false }: { player: DraggablePlayer; isDragging?: boolean }) {
    return (
        <div className={`flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-900 border border-white/8 ${isDragging ? 'opacity-50' : ''}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center border border-white/5">
                {player.avatar_url ? (
                    <Image
                        src={player.avatar_url}
                        alt={player.full_name || 'Player'}
                        width={32}
                        height={32}
                        className="object-cover w-8 h-8"
                        sizes="32px"
                    />
                ) : (
                    <Users className="w-4 h-4 text-zinc-600" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{player.full_name || 'Unknown'}</p>
                <p className="text-[10px] text-zinc-500 truncate">{player.position || 'No Position'}</p>
            </div>
            <div className={`px-2 py-0.5 rounded-lg text-xs font-black border shrink-0 ${getOVRColor(player.ovr)}`}>
                {player.ovr}
            </div>
        </div>
    );
}

function DraggablePlayerCard({ player }: { player: DraggablePlayer }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: player.id });
    const style = { transform: CSS.Translate.toString(transform) };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none cursor-grab active:cursor-grabbing">
            <PlayerCard player={player} isDragging={isDragging} />
        </div>
    );
}

function DroppableZone({
    id,
    label,
    players,
    accent,
}: {
    id: ZoneId;
    label: string;
    players: DraggablePlayer[];
    accent: string;
}) {
    const { isOver, setNodeRef } = useDroppable({ id });
    const avgOVR = useMemo(
        () => players.length === 0 ? 0 : Math.round(players.reduce((s, p) => s + p.ovr, 0) / players.length),
        [players]
    );

    return (
        <div className={`flex-1 rounded-2xl border-2 transition-colors ${isOver ? 'border-primary/60 bg-primary/5' : accent}`}>
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">{label}</h3>
                    {players.length > 0 && (
                        <span className="text-[10px] text-zinc-400 font-bold">
                            AVG OVR: <span className="text-white">{avgOVR}</span>
                        </span>
                    )}
                </div>

                <div ref={setNodeRef} className={`min-h-24 space-y-1.5 ${players.length === 0 ? 'flex items-center justify-center' : ''}`}>
                    {players.length === 0 ? (
                        <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">Drop here</p>
                    ) : (
                        players.map(p => <DraggablePlayerCard key={p.id} player={p} />)
                    )}
                </div>
            </div>
        </div>
    );
}

export function TeamDndBoard({ teamState, onMove }: TeamDndBoardProps) {
    const [activePlayer, setActivePlayer] = useState<DraggablePlayer | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
    );

    const allPlayers = useMemo(
        () => [...teamState.pool, ...teamState.team1, ...teamState.team2],
        [teamState]
    );

    function handleDragStart(event: DragStartEvent) {
        const player = allPlayers.find(p => p.id === event.active.id);
        setActivePlayer(player ?? null);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActivePlayer(null);
        const { active, over } = event;
        if (!over) return;
        const destination = over.id as ZoneId;
        onMove(active.id as string, destination);
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* Unassigned Pool */}
            <div className="rounded-2xl border border-white/10 bg-[#2A2827]">
                <div className="p-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                        Unassigned ({teamState.pool.length})
                    </h3>
                    <div className={`min-h-12 ${teamState.pool.length > 0 ? 'grid grid-cols-1 gap-1.5' : 'flex items-center justify-center'}`}>
                        {teamState.pool.length === 0 ? (
                            <p className="text-xs text-zinc-600 font-bold">All players assigned</p>
                        ) : (
                            teamState.pool.map(p => <DraggablePlayerCard key={p.id} player={p} />)
                        )}
                    </div>
                </div>
            </div>

            {/* Team Zones */}
            <div className="flex flex-col md:flex-row gap-3">
                <DroppableZone
                    id="team1"
                    label="Team Dark"
                    players={teamState.team1}
                    accent="border-zinc-600/50 bg-zinc-900/20"
                />
                <div className="flex items-center justify-center shrink-0">
                    <span className="text-lg font-black text-zinc-600">VS</span>
                </div>
                <DroppableZone
                    id="team2"
                    label="Team Light"
                    players={teamState.team2}
                    accent="border-amber-500/30 bg-amber-500/5"
                />
            </div>

            {/* Drag overlay — floating copy while dragging */}
            <DragOverlay>
                {activePlayer ? (
                    <div className="shadow-2xl rotate-2 opacity-95 w-64">
                        <PlayerCard player={activePlayer} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
