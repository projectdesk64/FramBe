import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const storedUserJSON = localStorage.getItem('farmbe_user');

        if (!storedUserJSON) {
            setError("No account found. Please Sign Up first.");
            return;
        }

        const storedUser = JSON.parse(storedUserJSON);

        // Simple validation (Demo checks only)
        if (storedUser.email === email && storedUser.password === password) {
            // Update role in case it drifted (though single user in this simple demo)
            localStorage.setItem('farmbe_role', storedUser.role);
            navigate(`/dashboard/${storedUser.role}`);
        } else {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-10 px-4 bg-slate-50">
            {/* Demo Badge */}
            <div className="absolute top-4 right-4">
                <Badge variant="outline" className="text-muted-foreground border-dashed">
                    Demo Mode v1.2
                </Badge>
            </div>

            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90 mt-4" type="submit">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary hover:underline font-medium">
                            Sign Up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
