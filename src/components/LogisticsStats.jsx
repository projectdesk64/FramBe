import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Truck, CheckCircle, Clock } from 'lucide-react';

export default function LogisticsStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50/50 border-blue-100">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Truck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Route Efficiency</p>
                        <p className="text-xl font-bold text-blue-700">3 Trips Saved</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-green-50/50 border-green-100">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Quality Check</p>
                        <p className="text-xl font-bold text-green-700">100% Pass</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-purple-50/50 border-purple-100">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Delivery On-Time</p>
                        <p className="text-xl font-bold text-purple-700">98.5%</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
