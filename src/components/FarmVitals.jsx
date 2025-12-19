import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Droplets, Banknote, MapPin } from 'lucide-react';

export default function FarmVitals() {
    return (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-100 mb-6">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-emerald-900 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        GreenEarth Estates (15 Acres)
                    </CardTitle>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full uppercase tracking-wide">
                        Active Season
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-200/50 rounded-full text-emerald-700">
                            <Sprout className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-emerald-900">Soil Health</p>
                            <p className="text-lg font-bold text-emerald-700">Nitrogen Rich (A+)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-200/50 rounded-full text-blue-700">
                            <Droplets className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-emerald-900">Water Level</p>
                            <p className="text-lg font-bold text-blue-700">85% (Reservoir Full)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-200/50 rounded-full text-yellow-700">
                            <Banknote className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-emerald-900">Current Yield Value</p>
                            <p className="text-lg font-bold text-emerald-800">₹ 4,50,000</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
