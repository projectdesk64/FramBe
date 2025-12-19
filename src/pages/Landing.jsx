import React, { useState } from 'react';
import {
    Leaf, Sun, Truck, ArrowRight, ShieldCheck, Sprout,
    Users, Package, Upload, CheckCircle, ShoppingCart, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import heroVideo from '../assets/Logo_Video.mp4';

import { Button } from "@/components/ui/button";

// --- DATA: TRUST STRIP STATS ---
const stats = [
    { icon: Users, label: 'Active Farmers', value: '500+' },
    { icon: Package, label: 'Monthly Orders', value: '12,000+' },
    { icon: Leaf, label: 'Organic Certified', value: '100%' },
];

// --- DATA: HOW IT WORKS STEPS ---
const farmerSteps = [
    {
        icon: Upload,
        title: 'List Your Stock',
        description: 'Upload your available produce with quantities and pricing.',
    },
    {
        icon: CheckCircle,
        title: 'Get Verified',
        description: 'Our team verifies your organic certification instantly.',
    },
    {
        icon: TrendingUp,
        title: 'Earn Fair Prices',
        description: 'Receive direct payments with no middleman markups.',
    },
];

const buyerSteps = [
    {
        icon: ShoppingCart,
        title: 'Browse Fresh Produce',
        description: 'Explore organic products from 500+ verified local farmers.',
    },
    {
        icon: CheckCircle,
        title: 'Place Bulk Orders',
        description: 'Order in quantity with special pricing for bulk purchases.',
    },
    {
        icon: TrendingUp,
        title: 'Next-Day Delivery',
        description: 'Fresh produce delivered within 24 hours of harvest.',
    },
];

export default function Landing() {
    const [role, setRole] = useState('buyer');
    const currentSteps = role === 'farmer' ? farmerSteps : buyerSteps;

    return (
        <div className="w-full bg-stone-50 font-sans text-stone-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[90vh] w-full flex flex-col md:grid md:grid-cols-12">
                {/* Left Column: Content */}
                <div className="order-1 md:order-1 md:col-span-5 flex flex-col justify-center px-6 py-16 md:px-12 lg:px-16 bg-stone-50 z-10">
                    <div className="max-w-xl mx-auto md:mx-0">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
                            From the Harvest <br />
                            Directly to Your Home.
                        </h1>
                        <p className="text-lg text-stone-600 mb-8 leading-relaxed font-normal max-w-md animate-fade-in-up-delay-1">
                            Bypassing the middleman to connect 500+ local farmers with your kitchen. Peak freshness, fair prices.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up-delay-2">
                            <Button asChild size="lg" className="h-14 text-lg px-10 shadow-xl hover:shadow-emerald-600/40">
                                <Link to="/signup">
                                    <span className="mr-2">Start Shopping</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="lg" className="h-14 text-lg px-8 text-stone-600 hover:bg-stone-200/50">
                                <Link to="/about">
                                    How it Works
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Video Visual */}
                <div className="order-2 md:order-2 md:col-span-7 relative h-[50vh] md:h-full overflow-hidden bg-stone-50 flex items-center justify-center">
                    <video
                        src={heroVideo}
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply" />
                </div>
            </section>

            {/* --- TRUST STRIP --- */}
            <div className="bg-emerald-600 py-12 border-y border-emerald-700">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-center justify-center gap-4"
                            >
                                <div className="p-3 bg-emerald-500/20 rounded-full">
                                    <stat.icon className="w-8 h-8 text-emerald-100" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white tracking-tight">
                                        {stat.value}
                                    </div>
                                    <div className="text-emerald-100/90 font-medium text-sm uppercase tracking-wide">
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- HOW IT WORKS SECTION (Interactive) --- */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 tracking-tight">
                            How It Works
                        </h2>
                        <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
                            Whether you're growing or eating, we make the process simple, transparent, and rewarding.
                        </p>

                        {/* Toggle Buttons */}
                        <div className="inline-flex items-center bg-stone-100 rounded-full p-1.5 border border-stone-200">
                            <Button
                                onClick={() => setRole('buyer')}
                                variant={role === 'buyer' ? 'default' : 'ghost'}
                                className={`rounded-full transition-all duration-300 ${role === 'buyer' ? 'shadow-md' : 'text-stone-600 hover:text-stone-900 hover:bg-transparent'}`}
                            >
                                I am a Buyer
                            </Button>
                            <Button
                                onClick={() => setRole('farmer')}
                                variant={role === 'farmer' ? 'default' : 'ghost'}
                                className={`rounded-full transition-all duration-300 ${role === 'farmer' ? 'shadow-md' : 'text-stone-600 hover:text-stone-900 hover:bg-transparent'}`}
                            >
                                I am a Farmer
                            </Button>
                        </div>
                    </motion.div>

                    {/* Animated Steps */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={role}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="grid md:grid-cols-3 gap-8 mt-16"
                        >
                            {currentSteps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative"
                                >
                                    <div className="bg-stone-50 rounded-3xl p-8 h-full border border-stone-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                                            <step.icon className="w-8 h-8 text-emerald-700" />
                                        </div>
                                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-2xl font-bold text-stone-900 mb-3 tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-stone-600 text-lg leading-relaxed">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* --- BENTO GRID FEATURES --- */}
            <section className="py-24 md:py-32 bg-stone-50">
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
                        <div className="md:col-span-2 bg-white rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
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
        </div>
    );
}