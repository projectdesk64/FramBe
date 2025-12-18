import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from '../lib/auth';

export default function Profile() {
    const userStr = localStorage.getItem('farmbe_user');
    let user = null;

    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error("Failed to parse user data", e);
    }

    if (!user) {
        return (
            <div className="container py-20 px-4 text-center">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Profile Not Found</CardTitle>
                        <CardDescription>No profile data found. Please log in again.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => window.location.href = '/login'}>
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const roleMap = {
        'farmer': 'Farmer',
        'pg': 'PG Owner / Hotel Owner',
        'middleman': 'Middleman'
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-0.5">
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">Manage your account information</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase border border-primary/20">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <CardTitle className="text-xl">{user.name}</CardTitle>
                            <CardDescription className="font-medium text-primary">
                                {roleMap[user.role] || user.role || 'User'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-muted-foreground" htmlFor="fullName">
                                Full Name
                            </label>
                            <Input
                                id="fullName"
                                value={user.name || ''}
                                readOnly
                                className="bg-muted focus-visible:ring-0 cursor-default"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-muted-foreground" htmlFor="email">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={user.email || ''}
                                readOnly
                                className="bg-muted focus-visible:ring-0 cursor-default"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-muted-foreground" htmlFor="role">
                                Assigned Role
                            </label>
                            <Input
                                id="role"
                                value={roleMap[user.role] || user.role || ''}
                                readOnly
                                className="bg-muted focus-visible:ring-0 cursor-default"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-3 border-t">
                        <Button variant="outline" className="flex-1 sm:flex-none" disabled>
                            Edit Profile (Demo)
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 sm:flex-none"
                            onClick={() => logout()}
                        >
                            Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="text-lg">Account Security</CardTitle>
                    <CardDescription>Authentication is managed via demo session.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">
                        Real-world authentication would involve backend validation and secure token storage.
                        This is a simulated environment using localStorage.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
