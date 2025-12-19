import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-upscale.png';

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-400 py-16 border-t border-stone-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src={logo}
                                alt="FarmBe"
                                className="h-8 w-auto opacity-90"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="text-xl font-bold text-white tracking-tight">FarmBe</span>
                        </div>
                        <p className="text-stone-500 max-w-sm leading-relaxed">
                            Reconnecting communities with sustainable agriculture through technology and trust.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/requests" className="hover:text-emerald-400 transition-colors">Browse Shop</Link></li>
                            <li><Link to="/farmers" className="hover:text-emerald-400 transition-colors">For Farmers</Link></li>
                            <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Log In</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                            <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-600">
                    <p>© 2024 FarmBe Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span>Made with ♥ for the Earth</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
