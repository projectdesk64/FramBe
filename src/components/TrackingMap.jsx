import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, MapPin, Home } from 'lucide-react';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const farmIcon = L.divIcon({
    html: `<div class="bg-emerald-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const homeIcon = L.divIcon({
    html: `<div class="bg-blue-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const truckIcon = L.divIcon({
    html: `<div class="bg-orange-500 text-white p-1.5 rounded-md shadow-lg border-2 border-white transform transition-transform duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="13" x="1" y="5" rx="2" ry="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>`,
    className: 'custom-div-icon z-50',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

// Component to fit bounds
function ChangeView({ bounds }) {
    const map = useMap();
    useEffect(() => {
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [bounds, map]);
    return null;
}

const TrackingMap = ({ source, destination }) => {
    // Demo Coordinates
    // Source: Farm (Bangalore), Destination: PG (Mysore)
    const farmPos = source || [12.9716, 77.5946];
    const pgPos = destination || [12.2958, 76.6394];

    // Truck animation state (percentage 0-100)
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 0; // Loop for demo
                return prev + 0.5; // Move speed
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Calculate truck position based on progress
    const getTruckPosition = () => {
        const lat = farmPos[0] + (pgPos[0] - farmPos[0]) * (progress / 100);
        const lng = farmPos[1] + (pgPos[1] - farmPos[1]) * (progress / 100);
        return [lat, lng];
    };

    const bounds = L.latLngBounds([farmPos, pgPos]);

    return (
        <MapContainer
            center={farmPos}
            zoom={8}
            className="h-full w-full rounded-lg z-0"
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <ChangeView bounds={bounds} />

            {/* Route Line */}
            <Polyline
                positions={[farmPos, pgPos]}
                color="#10b981" // Emerald-500
                weight={4}
                opacity={0.8}
                dashArray="10, 10"
            />

            {/* Markers */}
            <Marker position={farmPos} icon={farmIcon} />
            <Marker position={pgPos} icon={homeIcon} />

            {/* Animated Truck */}
            <Marker position={getTruckPosition()} icon={truckIcon} />

        </MapContainer>
    );
};

export default TrackingMap;
