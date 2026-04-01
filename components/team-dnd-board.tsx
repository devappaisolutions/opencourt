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
import { Users, GripVertical, X, ChevronRight } from 'lucide-react';
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

/** Static card used only inside DragOverlay (no handle, no tap) */
function PlayerCard({ player }: { player: DraggablePlayer }) {
    return (
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-900 border border-white/8">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center border border-white/5">
                {player.avatar_url ? (
                    <Image src={player.avatar_url} alt={player.full_name || 'Player'} width={32} height={32} className="object-cover w-8 h-8" sizes="32px" />
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

/** Interactive card: grip handle triggers drag, tapping body opens move sheet */
function DraggablePlayerCard({
    player,
    currentZone,
    onTap,
}: {
    player: DraggablePlayer;
    currentZone: ZoneId;
    onTap: (player: DraggablePlayer, zone: ZoneId) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: player.id });
    const style = { transform: CSS.Translate.toString(transform) };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div
                className={`flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-white/8 cursor-pointer active:bg-zinc-800 transition-colors ${isDragging ? 'opacity-40' : ''}`}
                onClick={() => onTap(player, currentZone)}
            >
                {/* Grip handle — drag events attached here only, so card body stays scrollable */}
                <div
                    {...listeners}
                    className="touch-none cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 shrink-0 p-0.5 -ml-0.5"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center border border-white/5">
                    {player.avatar_url ? (
                        <Image src={player.avatar_url} alt={player.full_name || 'Player'} width={32} height={32} className="object-cover w-8 h-8" sizes="32px" />
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
        </div>
    );
}

/** Bottom-sheet that lets the user tap to move a player to any zone */
function MoveSheet({
    player,
    currentZone,
    onMove,
    onClose,
}: {
    player: DraggablePlayer;
    currentZone: ZoneId;
    onMove: (playerId: string, destination: ZoneId) => void;
    onClose: () => void;
}) {
    const zones: { id: ZoneId; label: string; icon: string }[] = [
        { id: 'pool',  label: 'Unassigned Pool', icon: '—' },
        { id: 'team1', label: 'Team Dark',        icon: '⚫' },
        { id: 'team2', label: 'Team Light',       icon: '⚪' },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                onClick={onClose}
            />
            {/* Sheet */}
            <div className="fixed bottom-0 inset-x-0 z-[201] bg-zinc-950 rounded-t-3xl border-t border-white/10 p-5 pb-10 animate-in slide-in-from-bottom-4 duration-300">
                {/* Drag pill */}
                <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

                {/* Player header */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center border border-white/10">
                        {player.avatar_url ? (
                            <Image src={player.avatar_url} alt={player.full_name || 'Player'} width={40} height={40} className="object-cover" sizes="40px" />
                        ) : (
                            <Users className="w-5 h-5 text-zinc-600" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">Move Player</p>
                        <p className="text-white font-bold text-base truncate">{player.full_name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Zone options */}
                <div className="space-y-2">
                    {zones.map(zone => {
                        const isCurrent = zone.id === currentZone;
                        return (
                            <button
                                key={zone.id}
                                disabled={isCurrent}
                                onClick={() => { onMove(player.id, zone.id); onClose(); }}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                                    isCurrent
                                        ? 'bg-white/5 text-zinc-600 border border-white/5'
                                        : 'bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] text-white border border-white/8'
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-base">{zone.icon}</span>
                                    {zone.label}
                                </span>
                                {isCurrent
                                    ? <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Current</span>
                                    : <ChevronRight className="w-4 h-4 text-zinc-500" />
                                }
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

/** Unassigned pool — now a proper droppable so players can be dragged back */
function DroppablePool({
    players,
    onTap,
}: {
    players: DraggablePlayer[];
    onTap: (player: DraggablePlayer, zone: ZoneId) => void;
}) {
    const { isOver, setNodeRef } = useDroppable({ id: 'pool' });

    return (
        <div className={`rounded-2xl border transition-colors ${isOver ? 'border-primary/60 bg-primary/5' : 'border-white/10 bg-[#2A2827]'}`}>
            <div className="p-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                    Unassigned ({players.length})
                </h3>
                <div
                    ref={setNodeRef}
                    className={`min-h-12 ${players.length > 0 ? 'grid grid-cols-1 gap-1.5' : 'flex items-center justify-center'}`}
                >
                    {players.length === 0 ? (
                        <p className="text-xs text-zinc-600 font-bold">All players assigned</p>
                    ) : (
                        players.map(p => (
                            <DraggablePlayerCard key={p.id} player={p} currentZone="pool" onTap={onTap} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function DroppableZone({
    id,
    label,
    players,
    accent,
    onTap,
}: {
    id: ZoneId;
    label: string;
    players: DraggablePlayer[];
    accent: string;
    onTap: (player: DraggablePlayer, zone: ZoneId) => void;
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
                <div
                    ref={setNodeRef}
                    className={`min-h-24 space-y-1.5 ${players.length === 0 ? 'flex items-center justify-center' : ''}`}
                >
                    {players.length === 0 ? (
                        <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">Drop here</p>
                    ) : (
                        players.map(p => (
                            <DraggablePlayerCard key={p.id} player={p} currentZone={id} onTap={onTap} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export function TeamDndBoard({ teamState, onMove }: TeamDndBoardProps) {
    const [activePlayer, setActivePlayer] = useState<DraggablePlayer | null>(null);
    const [moveSheet, setMoveSheet] = useState<{ player: DraggablePlayer; zone: ZoneId } | null>(null);

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
        onMove(active.id as string, over.id as ZoneId);
    }

    function handleTap(player: DraggablePlayer, zone: ZoneId) {
        setMoveSheet({ player, zone });
    }

    return (
        <>
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {/* Unassigned Pool */}
                <DroppablePool players={teamState.pool} onTap={handleTap} />

                {/* Team Zones */}
                <div className="flex flex-col md:flex-row gap-3">
                    <DroppableZone id="team1" label="Team Dark"  players={teamState.team1} accent="border-zinc-600/50 bg-zinc-900/20" onTap={handleTap} />
                    <div className="flex items-center justify-center shrink-0">
                        <span className="text-lg font-black text-zinc-600">VS</span>
                    </div>
                    <DroppableZone id="team2" label="Team Light" players={teamState.team2} accent="border-amber-500/30 bg-amber-500/5" onTap={handleTap} />
                </div>

                {/* Floating card while dragging */}
                <DragOverlay>
                    {activePlayer ? (
                        <div className="shadow-2xl rotate-2 opacity-95 w-64">
                            <PlayerCard player={activePlayer} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Tap-to-move bottom sheet */}
            {moveSheet && (
                <MoveSheet
                    player={moveSheet.player}
                    currentZone={moveSheet.zone}
                    onMove={onMove}
                    onClose={() => setMoveSheet(null)}
                />
            )}
        </>
    );
}
