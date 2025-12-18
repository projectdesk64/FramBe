import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

// Demo data
const LOCATIONS = {
    farm_a: { id: 'farm_a', name: "Farm A (Nashik)", coords: [19.9975, 73.7898] },
    farm_b: { id: 'farm_b', name: "Farm B (Sangamner)", coords: [19.1663, 74.2081] },
    pg_pune: { id: 'pg_pune', name: "PG Location (Pune)", coords: [18.5913, 73.7389] },
    hotel_pune: { id: 'hotel_pune', name: "Hotel Location (Viman Nagar)", coords: [18.5679, 73.9143] }
};

const SOURCES = [LOCATIONS.farm_a, LOCATIONS.farm_b];
const DESTINATIONS = [LOCATIONS.pg_pune, LOCATIONS.hotel_pune];

// Custom icon for the truck
const truckIcon = L.divIcon({
    html: '<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))">🚚</div>',
    className: 'custom-truck-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// Component to handle map view updates
function MapUpdater({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

export default function OrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // Role detection
    const userRole = localStorage.getItem('farmbe_role') || 'pg';
    const isPGOwner = userRole === 'pg';

    // State for location selection
    const [sourceId, setSourceId] = useState('farm_a');
    const [destId, setDestId] = useState('pg_pune');

    // State for vehicle animation (Syncing Map and Status Bar)
    const [truckPos, setTruckPos] = useState(null);
    const [progress, setProgress] = useState(0);

    // Derived stable data (Adheres to Guardrail 1: No re-renders on every tick for logic)
    const source = useMemo(() => LOCATIONS[sourceId], [sourceId]);
    const destination = useMemo(() => LOCATIONS[destId], [destId]);

    // Calculate map bounds (Only updates when selection changes)
    const bounds = useMemo(() => {
        return L.latLngBounds([source.coords, destination.coords]);
    }, [source, destination]);

    // Animation Effect (Adheres to Guardrail 1: Only starts when From/To changes)
    useEffect(() => {
        if (!source || !destination) return;

        let animationFrame;
        const duration = 10000; // 10 seconds for one trip
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const p = (elapsed % duration) / duration;

            setProgress(p);

            // Straight polyline calculation (Adheres to Guardrail 2)
            const lat = source.coords[0] + (destination.coords[0] - source.coords[0]) * p;
            const lng = source.coords[1] + (destination.coords[1] - source.coords[1]) * p;

            setTruckPos([lat, lng]);
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [sourceId, destId]); // Explicit stable dependencies

    const headerMessage = isPGOwner
        ? "Your order is on the way"
        : "Delivery in progress to PG Owner";

    return (
        <div className="container py-10 px-4 space-y-6 max-w-5xl mx-auto">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
                &lsaquo; Back
            </Button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
                    <p className="text-muted-foreground text-lg mt-1">{headerMessage}</p>
                </div>
                <Badge variant="outline" className="w-fit text-sm py-1 px-3 border-primary/30 bg-primary/5">
                    Order ID: {orderId}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Summary and Controls */}
                <div className="space-y-6 lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Product</p>
                                    <p className="font-semibold">Fresh Tomatoes</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Quantity</p>
                                    <p className="font-semibold">50 kg</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Source (From)</label>
                                    {isPGOwner ? (
                                        <select
                                            value={sourceId}
                                            onChange={(e) => setSourceId(e.target.value)}
                                            className="w-full p-2 rounded-md border bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                                        >
                                            {SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    ) : (
                                        <p className="font-medium p-2 border rounded-md bg-muted/50">{source.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Destination (To)</label>
                                    {isPGOwner ? (
                                        <select
                                            value={destId}
                                            onChange={(e) => setDestId(e.target.value)}
                                            className="w-full p-2 rounded-md border bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                                        >
                                            {DESTINATIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    ) : (
                                        <p className="font-medium p-2 border rounded-md bg-muted/50">{destination.name}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Delivery Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-medium">In Transit</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Estimated Arrival</p>
                                <p className="text-sm font-semibold">Tomorrow, 10:30 AM</p>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                                <div
                                    className="bg-primary h-1.5 rounded-full"
                                    style={{ width: `${progress * 100}%` }}
                                ></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Interactive Map */}
                <Card className="lg:col-span-2 overflow-hidden border-none shadow-none lg:border lg:shadow-sm">
                    <CardHeader className="border-b bg-muted/30 py-3">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            Live Tracking (Demo)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 relative h-[500px]">
                        <MapContainer
                            bounds={bounds}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapUpdater bounds={bounds} />

                            <Marker position={source.coords}>
                                <Tooltip permanent direction="top" offset={[0, -20]}>Source: {source.name}</Tooltip>
                            </Marker>

                            <Marker position={destination.coords}>
                                <Tooltip permanent direction="top" offset={[0, -20]}>Destination: {destination.name}</Tooltip>
                            </Marker>

                            <Polyline
                                positions={[source.coords, destination.coords]}
                                pathOptions={{ color: '#6366f1', weight: 4, dashArray: '10, 10', opacity: 0.6 }}
                            />

                            {truckPos && (
                                <Marker position={truckPos} icon={truckIcon} zIndexOffset={1000} />
                            )}
                        </MapContainer>

                        {/* Overlay for map controls hint */}
                        <div className="absolute top-4 right-4 z-[1000] p-2 bg-background/80 backdrop-blur-sm border rounded shadow-sm text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            Interactive Demo Map
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
