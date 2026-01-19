"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

// Fix Leaflet's default icon path issues in Next.js
const icon = L.icon({
    iconUrl: "/images/marker-icon.png",
    shadowUrl: "/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Since we don't have local marker images yet, let's use a CDN or a colored div icon for now
// Or we can try to rely on the default if we fix the paths, but often it breaks in webpack.
// Let's use a custom DivIcon for a "Baller" look.
const customIcon = L.divIcon({
    className: "bg-transparent",
    html: `<div class="w-8 h-8 rounded-full bg-primary border-4 border-white shadow-xl flex items-center justify-center animate-bounce-slow">
             <div class="w-3 h-3 bg-white rounded-full"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export default function MapView() {
    const [games, setGames] = useState<any[]>([]);
    const [location, setLocation] = useState<[number, number]>([51.505, -0.09]); // Default London
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // 1. Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    // Silently fail to default location (New York) if denied/timed out
                    setLocation([40.7128, -74.0060]);
                }
            );
        }

        // 2. Fetch Games
        // Ideally we'd filter by lat/long, but for now fetch all
        const fetchGames = async () => {
            const { data } = await supabase
                .from('games')
                .select('*')
                .gte('date_time', new Date().toISOString()) // Only future games
                .order('date_time', { ascending: true });

            if (data) setGames(data);
            setLoading(false);
        };

        fetchGames();
    }, []);

    if (loading) return <div className="h-full w-full flex items-center justify-center text-zinc-500">Scouting courts...</div>;

    return (
        <MapContainer
            center={location}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ minHeight: "100%", background: "#18181b" }} // Match zinc-900
        >
            {/* Dark Mode Tiles - CartoDB Dark Matter */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* User Marker (Maybe different color) */}
            <Marker position={location} icon={customIcon}>
                <Popup className="glass-popup">
                    <div className="text-sm font-bold">You are here</div>
                </Popup>
            </Marker>

            {/* Game Markers */}
            {/* For now we need lat/long on games. The schema has 'location' text. 
                In a real app, we'd Geocode this string. 
                For this MVP, I'll randomly scatter them near the user or use fixed coords if available.
                Since we don't have coords in DB yet, I will MOCK the positions relative to the user for demo purposes.
            */}
            {games.map((game, idx) => {
                // Mock random offset for demo (since we only store text address currently)
                // In production, we need a 'lat' and 'lng' column in 'games' table.
                const latOffset = (Math.random() - 0.5) * 0.05;
                const lngOffset = (Math.random() - 0.5) * 0.05;
                const gamePos: [number, number] = [location[0] + latOffset, location[1] + lngOffset];

                return (
                    <Marker key={game.id} position={gamePos} icon={customIcon}>
                        <Popup className="glass-popup">
                            <div className="min-w-[200px] p-1">
                                <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                                    <MapPin className="w-3 h-3" /> {game.location}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-primary" />
                                        {new Date(game.date_time).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-primary" />
                                        {game.time}
                                    </div>
                                </div>
                                <Link
                                    href={`/game/${game.id}`}
                                    className="block w-full text-center bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90"
                                >
                                    View Game
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
