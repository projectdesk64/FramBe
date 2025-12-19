import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, MapPin, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('farmbe_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user data", error);
        }
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md w-full bg-white p-8 rounded-xl shadow-lg border-2 border-dashed border-stone-200">
                    <div className="mx-auto bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-stone-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-800 mb-2">Guest Access</h2>
                    <p className="text-stone-500 mb-6">Please log in to view your profile details.</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 w-full"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // Capitalize role logic with safety check
    const roleDisplay = (user.role && typeof user.role === 'string')
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : 'User';

    // Fake ID generation based on email length or random fallback
    const emailLen = (user.email && typeof user.email === 'string') ? user.email.length : 4;
    const accountId = `FARM-${emailLen * 1234}`;

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            {/* Header Banner */}
            <div className="relative h-48 bg-emerald-600">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                        <div className="w-32 h-32 bg-white rounded-full p-1 shadow-xl">
                            <div className="w-full h-full bg-stone-100 rounded-full flex items-center justify-center overflow-hidden">
                                <User className="w-16 h-16 text-stone-400" />
                            </div>
                        </div>
                        {/* Online Status Indicator */}
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto pt-24 px-4 pb-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-stone-800">{user.name || 'FarmBe User'}</h1>
                    <p className="text-stone-500 font-medium">{roleDisplay}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="p-6 md:p-8 space-y-6">
                        {/* Email Section */}
                        <div className="flex items-center space-x-4 p-4 bg-stone-50 rounded-lg border border-stone-100 hover:border-emerald-200 transition-colors duration-200">
                            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-stone-500 font-medium">Email Address</p>
                                <p className="text-lg text-stone-800 font-semibold">{user.email}</p>
                            </div>
                        </div>

                        {/* Role Section */}
                        <div className="flex items-center space-x-4 p-4 bg-stone-50 rounded-lg border border-stone-100 hover:border-amber-200 transition-colors duration-200">
                            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-stone-500 font-medium">Account Role</p>
                                <p className="text-lg text-stone-800 font-semibold">{roleDisplay}</p>
                            </div>
                        </div>

                        {/* Account ID Section */}
                        <div className="flex items-center space-x-4 p-4 bg-stone-50 rounded-lg border border-stone-100 hover:border-blue-200 transition-colors duration-200">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-stone-500 font-medium">Account ID</p>
                                <p className="text-lg text-stone-800 font-semibold">{accountId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 text-center">
                        <p className="text-sm text-stone-400">Member since {new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
