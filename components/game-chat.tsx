"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useRef, memo, useCallback, startTransition } from "react";
import { MessageCircle, Send, X } from "lucide-react";

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

const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' });

const MESSAGE_SELECT = `id, game_id, user_id, message, created_at, profiles:user_id (username, avatar_url)`;

const ChatBubble = memo(function ChatBubble({ msg, isOwn }: { msg: ChatMessage; isOwn: boolean }) {
    return (
        <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5 shrink-0 overflow-hidden">
                {msg.profiles?.avatar_url ? (
                    <img src={msg.profiles.avatar_url} alt={msg.profiles.username || 'User'} width={24} height={24} loading="lazy" className="w-6 h-6 object-cover" />
                ) : (
                    <span className="text-[9px] text-zinc-500 font-bold">{(msg.profiles?.username || '?')[0].toUpperCase()}</span>
                )}
            </div>
            <div className={`max-w-[75%] ${isOwn ? 'text-right' : ''}`}>
                <div className={`flex items-baseline gap-1.5 mb-0.5 ${isOwn ? 'justify-end' : ''}`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isOwn ? 'text-primary' : 'text-zinc-500'}`}>
                        {msg.profiles?.username || 'Unknown'}
                    </span>
                    <span className="text-[9px] text-zinc-700">{formatTime(msg.created_at)}</span>
                </div>
                <div className={`inline-block px-3 py-1.5 rounded-xl text-sm leading-snug ${isOwn ? 'bg-primary/20 text-white rounded-tr-sm' : 'bg-[#1F1D1D] text-zinc-300 rounded-tl-sm border border-white/5'}`}>
                    {msg.message}
                </div>
            </div>
        </div>
    );
});

const ChatInput = memo(function ChatInput({ gameId, userId }: { gameId: string; userId: string }) {
    const supabase = useRef(createClient()).current;
    const inputRef = useRef<HTMLInputElement>(null);
    const sendingRef = useRef(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = inputRef.current?.value?.trim();
        if (!value || !userId || sendingRef.current) return;
        sendingRef.current = true;
        try {
            const { error } = await supabase.from('game_chat').insert({ game_id: gameId, user_id: userId, message: value });
            if (error) throw error;
            if (inputRef.current) inputRef.current.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            sendingRef.current = false;
        }
    };

    return (
        <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-white/8 bg-[#2A2827]">
            <input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                maxLength={500}
                className="flex-1 h-9 bg-[#1F1D1D] border border-white/8 rounded-xl px-3 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30"
            />
            <button type="submit" className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white shrink-0 active:scale-90 transition-transform">
                <Send className="w-3.5 h-3.5" />
            </button>
        </form>
    );
});

export function GameChat({ gameId, userId }: GameChatProps) {
    const supabaseRef = useRef(createClient());
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isOpenRef = useRef(isOpen);
    const scrollRaf = useRef<number>(0);

    useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

    // Fetch last 50 messages on mount
    useEffect(() => {
        const supabase = supabaseRef.current;
        supabase.from('game_chat').select(MESSAGE_SELECT).eq('game_id', gameId)
            .order('created_at', { ascending: true }).limit(50)
            .then(({ data }) => { if (data) setMessages(data as unknown as ChatMessage[]); });
    }, [gameId]);

    // Real-time subscription
    useEffect(() => {
        const supabase = supabaseRef.current;
        const channel = supabase
            .channel(`game_chat_${gameId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'game_chat', filter: `game_id=eq.${gameId}` }, async (payload: any) => {
                const { data: newMsg } = await supabase.from('game_chat').select(MESSAGE_SELECT).eq('id', payload.new.id).single();
                if (newMsg) {
                    startTransition(() => {
                        setMessages(prev => prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg as unknown as ChatMessage]);
                    });
                    if (!isOpenRef.current) setUnreadCount(prev => prev + 1);
                }
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'game_chat', filter: `game_id=eq.${gameId}` }, (payload: any) => {
                startTransition(() => { setMessages(prev => prev.filter(m => m.id !== payload.old.id)); });
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [gameId]);

    // Auto-scroll when open
    useEffect(() => {
        if (isOpen && messages.length > 0) {
            cancelAnimationFrame(scrollRaf.current);
            scrollRaf.current = requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
            });
        }
    }, [messages, isOpen]);

    const handleToggle = useCallback(() => {
        setIsOpen(prev => {
            if (!prev) setUnreadCount(0);
            return !prev;
        });
    }, []);

    return (
        <div className="fixed bottom-20 right-4 sm:bottom-6 z-[150]">
            {/* Chat Panel — centered on mobile, above FAB on desktop */}
            {isOpen && (
                <div className="
                    fixed left-0 right-0 bottom-0 top-auto
                    sm:absolute sm:bottom-full sm:right-0 sm:left-auto sm:w-[360px] sm:mb-3 sm:rounded-2xl
                    bg-[#2A2827] border-t border-white/8 sm:border rounded-t-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200
                ">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#2A2827]">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-primary" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-white">Game Chat</h2>
                            {messages.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-400 text-[10px] font-bold">{messages.length}</span>
                            )}
                        </div>
                        <button onClick={handleToggle} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-72 overflow-y-auto p-3 space-y-3 bg-[#2A2827]" style={{ contain: 'content' }}>
                        {messages.length === 0 ? (
                            <p className="text-center text-zinc-600 text-xs py-10">No messages yet. Start the conversation!</p>
                        ) : (
                            messages.map(msg => <ChatBubble key={msg.id} msg={msg} isOwn={msg.user_id === userId} />)
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    {userId ? (
                        <ChatInput gameId={gameId} userId={userId} />
                    ) : (
                        <div className="p-3 border-t border-white/8 text-center">
                            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Sign in to chat</p>
                        </div>
                    )}
                </div>
            )}

            {/* FAB — hidden when chat is open */}
            <button
                onClick={handleToggle}
                className={`relative w-14 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 flex items-center justify-center transition-all active:scale-90 hover:scale-105 ${isOpen ? 'hidden' : ''}`}
                aria-label="Toggle chat"
            >
                <MessageCircle className="w-6 h-6" />
                {unreadCount > 0 && !isOpen && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-zinc-950 animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
}
