import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Phone, Download, Truck, Star, CheckCircle, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
import { useSearchParams } from 'react-router-dom';
import { demoStore } from "@/lib/demoStore";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Truck Icon
const truckIcon = new L.DivIcon({
    className: 'custom-truck-icon',
    html: `<div style="background-color: #059669; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); border: 3px solid white;">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Farm (Start) Icon - Blue
const farmIcon = new L.DivIcon({
    className: 'custom-farm-icon',
    html: `<div style="background-color: #3b82f6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid white;">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"></path><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"></path></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

// Farm (Start) and PG (End) Coordinates
const START_POS = [16.3067, 80.4365]; // Farm (Guntur area)
const END_POS = [16.3400, 80.4800];   // PG Stays (Vijayawada area)

const ETA = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId') || 'ORD-DEMO';

    const [truckPos, setTruckPos] = useState(START_POS);
    const [progress, setProgress] = useState(0);
    const [isDelivered, setIsDelivered] = useState(false);

    // Simulate movement
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(old => {
                if (old >= 100) {
                    clearInterval(interval);
                    if (!isDelivered) {
                        handleDeliveryComplete();
                    }
                    return 100;
                }
                return old + 0.4; // Slightly faster for demo
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isDelivered]);

    const handleDeliveryComplete = () => {
        setIsDelivered(true);
        // Update store
        demoStore.updateOrderStatus(orderId, "Delivered");
    };

    // Update truck position based on progress
    useEffect(() => {
        const lat = START_POS[0] + (END_POS[0] - START_POS[0]) * (progress / 100);
        const lng = START_POS[1] + (END_POS[1] - START_POS[1]) * (progress / 100);
        setTruckPos([lat, lng]);
    }, [progress]);

    const downloadInvoice = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(5, 150, 105); // Emerald color
        doc.text("FarmBe", 20, 20);

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Tax Invoice", 20, 30);

        doc.setFontSize(10);
        doc.text(`Order ID: ${orderId}`, 20, 45);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
        doc.text(`Status: Delivered`, 20, 55);

        doc.setLineWidth(0.5);
        doc.line(20, 60, 190, 60);

        doc.text("Description", 20, 70);
        doc.text("Amount", 160, 70);

        doc.line(20, 75, 190, 75);

        doc.text("Assorted Fresh Produce", 20, 85);
        doc.text("₹2,450.00", 160, 85);

        doc.line(20, 100, 190, 100);
        doc.setFont("helvetica", "bold");
        doc.text("Total Paid:", 20, 110);
        doc.text("₹2,450.00", 160, 110);

        doc.save(`FarmBe_Invoice_${orderId}.pdf`);
    };

    return (
        <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            {isDelivered ? (
                                <span className="text-emerald-600 flex items-center gap-2">
                                    <CheckCircle className="w-8 h-8" /> Delivered
                                </span>
                            ) : (
                                "Track Your Order"
                            )}
                        </h1>
                        <p className="text-gray-500 mt-1">Order ID: <span className="font-mono font-medium text-gray-700">{orderId}</span></p>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isDelivered && (
                            <Badge variant="outline" className="bg-white px-3 py-1 border-emerald-200 text-emerald-700 flex gap-2 items-center shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                Live Updates
                            </Badge>
                        )}
                        <Button
                            variant="outline"
                            className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
                            onClick={downloadInvoice}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Invoice
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200">
                            Need Help?
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Map Card */}
                    <Card className="lg:col-span-2 shadow-xl border-0 overflow-hidden rounded-2xl ring-1 ring-gray-100">
                        <div className="relative h-[500px] w-full">
                            <MapContainer
                                center={[16.32335, 80.45825]}
                                zoom={12}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                                dragging={true}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                />

                                <Polyline positions={[START_POS, END_POS]} color="#10b981" weight={6} opacity={0.5} />

                                {/* Farm Marker (Start) */}
                                <Marker position={START_POS} icon={farmIcon}>
                                    <Popup className="font-sans">
                                        <div className="p-1">
                                            <p className="font-bold text-gray-900">Lakshmi Organic Farms</p>
                                            <p className="text-xs text-gray-500">Source Location</p>
                                        </div>
                                    </Popup>
                                </Marker>

                                {/* Truck Marker */}
                                <Marker position={truckPos} icon={truckIcon}>
                                    <Popup className="font-sans">
                                        <div className="p-1 text-center">
                                            <p className="font-bold text-emerald-700">Ravi Teja</p>
                                            <p className="text-xs text-gray-500">Logistics Partner</p>
                                        </div>
                                    </Popup>
                                </Marker>

                                {/* Destination Marker */}
                                <Marker position={END_POS}>
                                    <Popup className="font-sans">
                                        <div className="p-1">
                                            <p className="font-bold text-gray-900">Sai PG Stays</p>
                                            <p className="text-xs text-gray-500">Delivery Location</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>

                            {/* overlay gradient for better text visibility if needed, or just cleaner look */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                        </div>
                    </Card>

                    {/* Status & Driver Sidebar */}
                    <div className="space-y-6">
                        {/* Live Status Card */}
                        <Card className="border-0 shadow-lg ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                            <div className={`h-2 w-full ${isDelivered ? 'bg-gray-400' : 'bg-emerald-500 animate-pulse'}`} />
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                        {isDelivered ? "Arrived" : `${Math.ceil(15 * (1 - progress / 100))} min`}
                                    </h2>
                                    <p className="text-gray-500 font-medium mt-1">
                                        {isDelivered ? "Order Delivered Successfully" : "Estimated Arrival Time"}
                                    </p>
                                </div>

                                <div className="relative pl-8 border-l-2 border-emerald-100 space-y-8 pb-2">
                                    <div className="relative">
                                        <span className="absolute -left-[39px] bg-emerald-100 p-1.5 rounded-full border-4 border-white shadow-sm">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                        </span>
                                        <p className="font-bold text-gray-900 text-sm">Order Confirmed</p>
                                        <p className="text-xs text-gray-500">Your order has been verified.</p>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute -left-[39px] bg-emerald-100 p-1.5 rounded-full border-4 border-white shadow-sm">
                                            <Truck className="w-5 h-5 text-emerald-600" />
                                        </span>
                                        <p className="font-bold text-gray-900 text-sm">Out for Delivery</p>
                                        <p className="text-xs text-gray-500">Ravi Teja has picked up your order.</p>
                                    </div>
                                    <div className={`relative transition-opacity duration-500 ${isDelivered ? 'opacity-100' : 'opacity-40'}`}>
                                        <span className={`absolute -left-[39px] p-1.5 rounded-full border-4 border-white shadow-sm ${isDelivered ? 'bg-emerald-600' : 'bg-gray-100'}`}>
                                            <MapPin className={`w-5 h-5 ${isDelivered ? 'text-white' : 'text-gray-400'}`} />
                                        </span>
                                        <p className="font-bold text-gray-900 text-sm">Delivered</p>
                                        <p className="text-xs text-gray-500">Package safely delivered at gate.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Driver Card */}
                        <Card className="border-0 shadow-lg ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                            <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
                                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Delivery Partner</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-stone-200 overflow-hidden border-2 border-white shadow-md">
                                        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" alt="Driver" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg">Ravi Teja</h3>
                                        <p className="text-sm text-gray-500">KA 04 HA 1234 • Tata Ace</p>
                                        <div className="flex items-center gap-1 mt-1 bg-yellow-50 w-fit px-2 py-0.5 rounded-md border border-yellow-100">
                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs text-yellow-700 font-bold">4.9</span>
                                        </div>
                                    </div>
                                    <Button size="icon" className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-md">
                                        <Phone className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="mt-6">
                                    <p className="text-xs font-medium text-gray-500 italic text-center">"Super fast delivery, ensured fresh veggies!"</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delivery Success Toast/Overlay */}
            {isDelivered && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-bottom duration-700 fade-in">
                    <div className="bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-gray-700">
                        <div className="bg-emerald-500 rounded-full p-1 animate-pulse">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Order Delivered!</p>
                            <p className="text-xs text-gray-300">Enjoy your fresh produce.</p>
                        </div>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="ml-4 rounded-full bg-white text-gray-900 hover:bg-gray-200"
                            onClick={() => window.location.href = '/dashboard/pg'}
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ETA;
