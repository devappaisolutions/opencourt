"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useRef, memo } from "react";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface ChatMessage {
    id: string;
    game_id: string;
    user_id: string;
    message: string;
    created_at: string;
    profiles: {
        username: string;
        avatar_url: string | null;
    };
}

interface GameChatProps {
    gameId: string;
    userId: string;
}

const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Manila'
    });
};

const ChatBubble = memo(function ChatBubble({ msg, isOwn }: { msg: ChatMessage; isOwn: boolean }) {
    return (
        <div className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5 shrink-0 overflow-hidden">
                {msg.profiles?.avatar_url ? (
                    <Image
                        src={msg.profiles.avatar_url}
                        alt={msg.profiles.username || 'User'}
                        width={28}
                        height={28}
                        className="object-cover"
                        sizes="28px"
                    />
                ) : (
                    <span className="text-[10px] text-zinc-600 font-bold">
                        {(msg.profiles?.username || '?')[0].toUpperCase()}
                    </span>
                )}
            </div>
            <div className={`max-w-[75%] ${isOwn ? 'text-right' : ''}`}>
                <div className={`flex items-baseline gap-2 mb-0.5 ${isOwn ? 'justify-end' : ''}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isOwn ? 'text-primary' : 'text-zinc-500'}`}>
                        {msg.profiles?.username || 'Unknown'}
                    </span>
                    <span className="text-[9px] text-zinc-700">
                        {formatTime(msg.created_at)}
                    </span>
                </div>
                <div
                    className={`inline-block px-3 py-1.5 rounded-xl text-sm ${
                        isOwn
                            ? 'bg-primary/20 text-white rounded-tr-sm'
                            : 'bg-white/5 text-zinc-300 rounded-tl-sm'
                    }`}
                    style={{ wordBreak: 'break-word' }}
                >
                    {msg.message}
                </div>
            </div>
        </div>
    );
});

// Completely isolated input — has its own state, never re-renders from parent
const ChatInput = memo(function ChatInput({ gameId, userId }: { gameId: string; userId: string }) {
    const supabase = useRef(createClient()).current;
    const inputRef = useRef<HTMLInputElement>(null);
    const [sending, setSending] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = inputRef.current?.value?.trim();
        if (!value || !userId || sending) return;

        setSending(true);
        try {
            const { error } = await supabase
                .from('game_chat')
                .insert({
                    game_id: gameId,
                    user_id: userId,
                    message: value,
                });
            if (error) throw error;
            if (inputRef.current) inputRef.current.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <form
            onSubmit={handleSend}
            className="flex items-center gap-2 p-3 border-t border-white/5"
        >
            <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                maxLength={500}
                className="flex-1 h-10 bg-zinc-900/50 border border-white/10 rounded-xl px-4 text-base text-white placeholder:text-zinc-600 focus:outline-none"
            />
            <button
                type="submit"
                disabled={sending}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
                <Send className="w-4 h-4" />
            </button>
        </form>
    );
});

const MESSAGE_SELECT = `
    id, game_id, user_id, message, created_at,
    profiles:user_id (username, avatar_url)
`;

export function GameChat({ gameId, userId }: GameChatProps) {
    const supabaseRef = useRef(createClient());
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isExpandedRef = useRef(isExpanded);

    useEffect(() => {
        isExpandedRef.current = isExpanded;
    }, [isExpanded]);

    useEffect(() => {
        const supabase = supabaseRef.current;
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('game_chat')
                .select(MESSAGE_SELECT)
                .eq('game_id', gameId)
                .order('created_at', { ascending: true })
                .limit(50);

            if (data) setMessages(data as unknown as ChatMessage[]);
        };
        fetchMessages();
    }, [gameId]);

    useEffect(() => {
        const supabase = supabaseRef.current;
        const channel = supabase
            .channel(`game_chat_${gameId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'game_chat',
                filter: `game_id=eq.${gameId}`
            }, async (payload: any) => {
                const { data: newMsg } = await supabase
                    .from('game_chat')
                    .select(MESSAGE_SELECT)
                    .eq('id', payload.new.id)
                    .single();

                if (newMsg) {
                    setMessages(prev => {
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg as unknown as ChatMessage];
                    });
                    if (!isExpandedRef.current) {
                        setUnreadCount(prev => prev + 1);
                    }
                }
            })
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'game_chat',
                filter: `game_id=eq.${gameId}`
            }, (payload: any) => {
                setMessages(prev => prev.filter(m => m.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [gameId]);

    useEffect(() => {
        if (isExpanded) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isExpanded]);

    const handleToggle = () => {
        setIsExpanded(prev => !prev);
        if (!isExpanded) setUnreadCount(0);
    };

    return (
        <div className="bg-[#2A2827] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <button
                onClick={handleToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                        Game Chat
                    </h2>
                    {messages.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-400 text-xs font-bold">
                            {messages.length}
                        </span>
                    )}
                    {unreadCount > 0 && !isExpanded && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold animate-pulse">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                {isExpanded
                    ? <ChevronUp className="w-5 h-5 text-zinc-500" />
                    : <ChevronDown className="w-5 h-5 text-zinc-500" />
                }
            </button>

            {isExpanded && (
                <div className="border-t border-white/5">
                    <div className="h-64 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 ? (
                            <p className="text-center text-zinc-600 text-sm py-8">
                                No messages yet. Start the conversation!
                            </p>
                        ) : (
                            messages.map((msg) => (
                                <ChatBubble
                                    key={msg.id}
                                    msg={msg}
                                    isOwn={msg.user_id === userId}
                                />
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {userId ? (
                        <ChatInput gameId={gameId} userId={userId} />
                    ) : (
                        <div className="p-3 border-t border-white/5 text-center">
                            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
                                Sign in to chat
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
