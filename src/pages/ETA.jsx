import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Phone, Download, Truck, Star, CheckCircle, MapPin, ChevronLeft, Navigation, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
import { useSearchParams, useNavigate } from 'react-router-dom';
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
    html: `<div style="background-color: #059669; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px -3px rgba(5, 150, 105, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1); border: 4px solid white; position: relative;">
             <span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #34d399; opacity: 0.3; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="position: relative; z-index: 10;"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
});

// Farm (Start) Icon
const farmIcon = new L.DivIcon({
    className: 'custom-farm-icon',
    html: `<div style="background-color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid #e5e7eb;">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"></path><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"></path></svg>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Destination Icon
const destIcon = new L.DivIcon({
    className: 'custom-dest-icon',
    html: `<div style="background-color: #111827; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid white;">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M8 9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12H8V9z"/></svg>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Farm (Start) and PG (End) Coordinates
const START_POS = [16.3067, 80.4365]; // Farm (Guntur area)
const END_POS = [16.3400, 80.4800];   // PG Stays (Vijayawada area)

const ETA = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('orderId') || 'ORD-DEMO';

    const [truckPos, setTruckPos] = useState(START_POS);
    const [progress, setProgress] = useState(0);
    const [isDelivered, setIsDelivered] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

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

        // --- Header ---
        doc.setFontSize(24);
        doc.setTextColor(5, 150, 105);
        doc.setFont("helvetica", "bold");
        doc.text("FarmBe", 20, 25);

        doc.setFontSize(36);
        doc.setTextColor(200, 200, 200);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 140, 25);

        // --- Info Section ---
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.setFont("helvetica", "normal");

        doc.text(`Order ID: ${orderId}`, 20, 45);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
        doc.text(`Status: Delivered`, 20, 55);

        doc.setFont("helvetica", "bold");
        doc.text("From:", 120, 45);
        doc.setFont("helvetica", "normal");
        doc.text("Lakshmi Organic Farms", 120, 50);
        doc.text("Guntur, AP", 120, 55);

        doc.setFont("helvetica", "bold");
        doc.text("To:", 120, 65);
        doc.setFont("helvetica", "normal");
        doc.text("Sai PG Stays", 120, 70);
        doc.text("Vijayawada, AP", 120, 75);

        // --- Divider ---
        doc.setDrawColor(220, 220, 220);
        doc.line(20, 85, 190, 85);

        // --- Itemized List ---
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Item Description", 20, 95);
        doc.text("Qty", 110, 95);
        doc.text("Price/Kg", 140, 95);
        doc.text("Total", 170, 95);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);

        doc.text("Farm Fresh Tomatoes", 20, 105);
        doc.text("50 kg", 110, 105);
        doc.text("₹25.00", 140, 105);
        doc.text("₹1,250.00", 170, 105);

        doc.text("Organic Red Onions", 20, 112);
        doc.text("30 kg", 110, 112);
        doc.text("₹40.00", 140, 112);
        doc.text("₹1,200.00", 170, 112);

        doc.line(20, 120, 190, 120);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Total Amount:", 120, 130);
        doc.text("₹2,450.00", 170, 130);

        // --- PAID Stamp ---
        doc.setTextColor(22, 163, 74);
        doc.setDrawColor(22, 163, 74);
        doc.setLineWidth(1);
        doc.roundedRect(150, 140, 40, 14, 2, 2);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("PAID", 160, 150);

        doc.setFontSize(10);
        doc.text("via UPI", 163, 160);

        doc.save(`FarmBe_Invoice_${orderId}.pdf`);
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-stone-50 font-sans">

            {/* 1. Full Screen Map */}
            <div className="absolute inset-0 z-0">
                <MapContainer
                    center={[16.32335, 80.45825]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    <Polyline
                        positions={[START_POS, END_POS]}
                        color="#059669"
                        weight={5}
                        opacity={0.6}
                        dashArray="10, 10"
                    />

                    <Marker position={START_POS} icon={farmIcon}>
                        <Popup className="font-sans">
                            <p className="font-bold text-gray-900">Lakshmi Organic Farms</p>
                        </Popup>
                    </Marker>

                    <Marker position={truckPos} icon={truckIcon} zIndexOffset={100}>
                        <Popup className="font-sans">
                            <p className="font-bold text-emerald-700">Ravi Teja (Driver)</p>
                        </Popup>
                    </Marker>

                    <Marker position={END_POS} icon={destIcon}>
                        <Popup className="font-sans">
                            <p className="font-bold text-gray-900">Sai PG Stays</p>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* 2. Top Floating Bar (Glassmorphism) */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/90 backdrop-blur-md shadow-lg rounded-full hover:bg-white text-gray-700 h-10 w-10"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                </div>

                <div className="flex flex-col items-end gap-3 pointer-events-auto">
                    <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-5 py-3 border border-gray-100 flex items-center gap-4">
                        <div>
                            <p className="text-xs text-stone-500 font-bold tracking-wider uppercase">Order ID</p>
                            <p className="font-mono text-sm font-bold text-stone-800">{orderId}</p>
                        </div>
                        <div className="h-8 w-px bg-stone-200"></div>
                        <div>
                            <p className="text-xs text-stone-500 font-bold tracking-wider uppercase">Status</p>
                            <p className={`text-sm font-extrabold flex items-center gap-1.5 ${isDelivered ? 'text-emerald-600' : 'text-amber-500'}`}>
                                {isDelivered ? (
                                    <> <CheckCircle className="w-4 h-4" /> Delivered </>
                                ) : (
                                    <> <Navigation className="w-4 h-4 animate-pulse" /> In Transit </>
                                )}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={downloadInvoice}
                        className="bg-stone-900 text-white hover:bg-black rounded-full shadow-xl px-5 h-10 gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Invoice
                    </Button>
                </div>
            </div>

            {/* 3. Bottom Floating Panel */}
            <div className="absolute bottom-6 left-4 right-4 z-20 flex justify-center pointer-events-none">
                <div className="w-full max-w-md pointer-events-auto">
                    <Card className="rounded-[2.5rem] border-0 shadow-2xl overflow-hidden bg-white/95 backdrop-blur-xl ring-1 ring-black/5">

                        {/* Progress Bar (at top of card) */}
                        <div className="h-1.5 w-full bg-stone-100">
                            <div
                                className={`h-full transition-all duration-300 ${isDelivered ? 'bg-emerald-500' : 'bg-stone-800'}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="p-6">
                            {/* Time Status */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-baseline gap-1">
                                        {isDelivered ? "Arrived" : Math.ceil(15 * (1 - progress / 100))}
                                        {!isDelivered && <span className="text-lg text-stone-500 font-bold">min</span>}
                                    </h2>
                                    <p className="text-stone-500 text-sm font-medium">
                                        {isDelivered ? "Package delivered safely" : "Estimated arrival time"}
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Driver Profile */}
                            <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
                                        alt="Driver"
                                        className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center">
                                        <Star className="w-2.5 h-2.5 text-white fill-current" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-stone-900">Ravi Teja</h3>
                                            <p className="text-xs text-stone-500 font-medium">Tata Ace • KA 04 HA 1234</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md shadow-sm border border-stone-100">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-bold text-stone-700">4.9</span>
                                        </div>
                                    </div>
                                </div>
                                <Button size="icon" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg h-10 w-10 shrink-0">
                                    <Phone className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Delivery Toast Overlay */}
            {isDelivered && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-500">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full mx-6 text-center space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-stone-900">Order Delivered!</h2>
                            <p className="text-stone-500 mt-2">Your fresh produce has been delivered safely to Sai PG Stays.</p>
                        </div>
                        <div className="pt-4 grid gap-3">
                            <Button className="w-full bg-stone-900 text-white hover:bg-black rounded-xl h-12 text-base" onClick={() => navigate('/dashboard/pg')}>
                                Back to Dashboard
                            </Button>
                            <Button variant="outline" className="w-full border-stone-200 rounded-xl h-12 text-base" onClick={downloadInvoice}>
                                Download Invoice
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ETA;
