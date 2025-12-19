import React from 'react';
import { Leaf, Sun, Truck, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { useState, useEffect } from 'react';
import logo from '../assets/logo-upscale.png';
import heroVideo from '../assets/Logo_Video.mp4';

export default function Landing() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('farmbe_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('farmbe_user');
        localStorage.removeItem('farmbe_role');
        setUser(null);
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
            <Navbar variant="landing" user={user} onLogout={handleLogout} />

            {/* --- HERO SECTION: THE BIG BANG (Option C - Split Layout) --- */}
            <section className="relative min-h-[90vh] w-full flex flex-col md:grid md:grid-cols-2">

                {/* Left Column: Content */}
                <div className="order-1 md:order-1 flex flex-col justify-center px-6 py-16 md:px-12 lg:px-20 bg-stone-50">
                    <div className="max-w-xl mx-auto md:mx-0">
                        {/* Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
                            From the Harvest <br />
                            Directly to Your Home.
                        </h1>

                        {/* Subhead */}
                        <p className="text-lg text-stone-600 mb-8 leading-relaxed font-normal max-w-md animate-fade-in-up-delay-1">
                            Bypassing the middleman to connect 500+ local farmers with your kitchen. Peak freshness, fair prices.
                        </p>

                        {/* CTA Group */}
                        <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up-delay-2">
                            <Link
                                to="/signup"
                                className="group inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-emerald-600 px-8 font-medium text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                            >
                                <span className="mr-2">Start Shopping</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex h-12 items-center justify-center rounded-xl px-8 font-medium text-stone-600 hover:bg-stone-200/50 transition-colors"
                            >
                                How it Works
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Video Visual */}
                <div className="order-2 md:order-2 relative h-[0vh] md:h-auto overflow-hidden">
                    <video
                        src={heroVideo}
                        className="absolute inset-1 w-full h-full object-contain"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    {/* Optional Subtle Overlay for Polish */}
                    <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply" />
                </div>
            </section>

            {/* --- STATS TICKER --- */}
            <div className="relative z-20 -mt-10 mx-6">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-stone-100">
                    <StatItem number="500+" label="Active Farmers" />
                    <StatItem number="12k+" label="Monthly Orders" />
                    <StatItem number="100%" label="Organic Certified" />
                    <StatItem number="24hr" label="Farm to Table" />
                </div>
            </div>

            {/* --- BENTO GRID FEATURES --- */}
            <section className="py-24 md:py-32">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight">
                            Freshness You Can Trust
                        </h2>
                        <p className="text-stone-500 max-w-xl mx-auto">
                            We've re-engineered the supply chain to put quality and transparency first.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
                        {/* Large Visual Card */}
                        <div className="md:col-span-2 bg-stone-100 rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80"
                                alt="Fresh Veggies"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                            <div className="relative z-10 h-full flex flex-col justify-end text-white">
                                <Leaf className="w-10 h-10 text-emerald-400 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">100% Organic & Pesticide Free</h3>
                                <p className="text-stone-200 max-w-md">Every item is vetted for safety. No harmful chemicals, just pure nature.</p>
                            </div>
                        </div>

                        {/* Dark Statement Card */}
                        <div className="bg-emerald-900 rounded-3xl p-8 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center text-emerald-300">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Fair Trade First</h3>
                                <p className="text-emerald-200/80 text-sm">Farmers set their own prices. We ensure they get paid what they deserve.</p>
                            </div>
                        </div>

                        {/* Light Card */}
                        <div className="bg-white border border-stone-200 rounded-3xl p-8 flex flex-col justify-between group hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Next Day Delivery</h3>
                                <p className="text-stone-500 text-sm">Harvested this morning, at your doorstep tomorrow morning.</p>
                            </div>
                        </div>

                        {/* Image Card 2 */}
                        <div className="md:col-span-2 bg-stone-200 rounded-3xl p-8 relative overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80"
                                alt="Farmer"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
                            <div className="relative z-10 h-full flex flex-col justify-end text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <Sprout className="w-6 h-6 text-emerald-400" />
                                    <h3 className="text-2xl font-bold">Meet Your Grower</h3>
                                </div>
                                <p className="text-stone-200">Know exactly who grew your food and where it came from.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            {/* --- FOOTER --- */}
            <Footer />
        </div>
    );
}

// Simple Helper Component for Stats
function StatItem({ number, label }) {
    return (
        <div className="text-center px-2">
            <div className="text-2xl md:text-3xl font-bold text-stone-900 mb-1">{number}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</div>
        </div>
    );
}