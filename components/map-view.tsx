"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function MapView() {
    const [games, setGames] = useState<any[]>([]);
    const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 14.0693, lng: 121.3265 }); // Default: San Pablo, Philippines
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState<any | null>(null);
    const supabase = createClient();

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    useEffect(() => {
        // 1. Get User Location
        if (navigator.geolocation) {
            console.log("🗺️ Requesting user location...");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("✅ Location obtained:", position.coords.latitude, position.coords.longitude);
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("❌ Geolocation error:", error.message);
                    console.log("Using default location (San Pablo, Philippines)");
                    // Silently fail to default location (San Pablo) if denied/timed out
                    setLocation({ lat: 14.0693, lng: 121.3265 });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            console.error("❌ Geolocation is not supported by this browser");
            setLocation({ lat: 14.0693, lng: 121.3265 });
        }

        // 2. Fetch Games
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

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center text-zinc-500">
                Scouting courts...
            </div>
        );
    }

    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
        return (
            <div className="h-full w-full flex items-center justify-center p-8">
                <div className="text-center space-y-4 max-w-md">
                    <div className="text-6xl">🗺️</div>
                    <h3 className="text-xl font-bold text-white">Google Maps API Key Required</h3>
                    <p className="text-zinc-400 text-sm">
                        To use Google Maps, please add your API key to the <code className="bg-zinc-800 px-2 py-1 rounded text-primary">.env.local</code> file:
                    </p>
                    <div className="bg-zinc-900 p-4 rounded-lg text-left text-xs font-mono text-zinc-300 border border-zinc-800">
                        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
                    </div>
                    <p className="text-zinc-500 text-xs">
                        Get your API key from{" "}
                        <a
                            href="https://console.cloud.google.com/google/maps-apis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Google Cloud Console
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={location}
                defaultZoom={13}
                mapId="opencourt-map"
                className="w-full h-full"
                style={{ minHeight: "100%" }}
                gestureHandling="greedy"
                disableDefaultUI={false}
                styles={[
                    {
                        "elementType": "geometry",
                        "stylers": [{ "color": "#212121" }]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#757575" }]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [{ "color": "#212121" }]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#757575" }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#757575" }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#181818" }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#616161" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry.fill",
                        "stylers": [{ "color": "#2c2c2c" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#8a8a8a" }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#373737" }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#3c3c3c" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#000000" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#3d3d3d" }]
                    }
                ]}
            >
                {/* User Marker */}
                <AdvancedMarker position={location}>
                    <Pin
                        background="#3b82f6"
                        borderColor="#1e40af"
                        glyphColor="#ffffff"
                    />
                </AdvancedMarker>


                {/* Game Markers */}
                {games.map((game, idx) => {
                    let gamePos: { lat: number; lng: number };

                    // Check if game has real coordinates in the database
                    if (game.latitude && game.longitude) {
                        // Use real coordinates from database
                        gamePos = {
                            lat: game.latitude,
                            lng: game.longitude
                        };
                    } else {
                        // Fallback: Use consistent hash-based offset
                        // This ensures pins stay in the same place for each game

                        // Simple hash function to generate consistent offsets from game ID
                        const hashString = (str: string) => {
                            let hash = 0;
                            for (let i = 0; i < str.length; i++) {
                                const char = str.charCodeAt(i);
                                hash = ((hash << 5) - hash) + char;
                                hash = hash & hash; // Convert to 32bit integer
                            }
                            return hash;
                        };

                        const hash = hashString(game.id);
                        // Use hash to generate consistent offsets between -0.025 and +0.025 degrees
                        const latOffset = ((hash % 1000) / 1000 - 0.5) * 0.05;
                        const lngOffset = (((hash >> 10) % 1000) / 1000 - 0.5) * 0.05;

                        gamePos = {
                            lat: location.lat + latOffset,
                            lng: location.lng + lngOffset
                        };
                    }

                    return (
                        <AdvancedMarker
                            key={game.id}
                            position={gamePos}
                            onClick={() => setSelectedGame(game)}
                        >
                            <Pin
                                background="#a855f7"
                                borderColor="#7e22ce"
                                glyphColor="#ffffff"
                            />
                        </AdvancedMarker>
                    );
                })}

                {/* Info Window for selected game */}
                {selectedGame && (
                    <InfoWindow
                        position={{
                            lat: location.lat + (Math.random() - 0.5) * 0.05,
                            lng: location.lng + (Math.random() - 0.5) * 0.05
                        }}
                        onCloseClick={() => setSelectedGame(null)}
                    >
                        <div className="min-w-[200px] p-2 bg-zinc-900 text-white rounded-lg">
                            <h3 className="font-bold text-lg mb-1">{selectedGame.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                                <MapPin className="w-3 h-3" /> {selectedGame.location}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-primary" />
                                    {new Date(selectedGame.date_time).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-primary" />
                                    {selectedGame.time}
                                </div>
                            </div>
                            <Link
                                href={`/game/${selectedGame.id}`}
                                className="block w-full text-center bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90"
                            >
                                View Game
                            </Link>
                        </div>
                    </InfoWindow>
                )}
            </Map>
        </APIProvider>
    );
}
