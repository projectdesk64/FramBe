import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const roles = [
        { id: 'farmer', title: 'Farmer', description: 'Sell your produce directly to businesses' },
        { id: 'pg', title: 'PG Owner / Hotel Owner', description: 'Source fresh produce for your kitchen' },
        { id: 'middleman', title: 'Middleman', description: 'Manage logistics and supply chain' },
    ];

    const handleContinue = (e) => {
        e.preventDefault();
        if (!selectedRole) {
            alert('Please select a role to continue.');
            return;
        }

        // For demo purposes, we store the role and navigate
        localStorage.setItem('farmbe_role', selectedRole);
        navigate(`/dashboard/${selectedRole}`);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-10 px-4">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to FarmBe</h1>
                    <p className="text-muted-foreground text-lg">Choose your role to get started</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {roles.map((role) => (
                        <Card
                            key={role.id}
                            className={`cursor-pointer transition-all border-2 ${selectedRole === role.id
                                ? 'border-primary ring-1 ring-primary'
                                : 'hover:border-primary/50 border-transparent'
                                }`}
                            onClick={() => setSelectedRole(role.id)}
                        >
                            <CardHeader className="p-4">
                                <CardTitle className="text-base">{role.title}</CardTitle>
                                <CardDescription className="text-xs">{role.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-xl">Login</CardTitle>
                        <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleContinue} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button className="w-full" type="submit">
                                Continue as {selectedRole ? roles.find(r => r.id === selectedRole).title : '...'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account? <span className="text-primary hover:underline cursor-pointer">Sign up</span>
                </p>
            </div>
        </div>
    );
}
