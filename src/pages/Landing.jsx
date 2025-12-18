import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Landing = () => {
    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight">FarmBe</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Transparent agricultural supply chain management.
                        Directly connect farmers with enterprise buyers.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/signup">
                            <Button size="lg">Get Started</Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg">Sign In</Button>
                        </Link>
                    </div>
                </section>

                {/* Models Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Our Models</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Direct Model</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Farmers sell directly to buyers. Maximum profit, complete control, total transparency.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Assisted Model</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We help manage logistics and negotiations. Ideal for those who need support with transport and payments.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Transparency Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Transparency</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Real-time Order Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Know exactly where your produce is. From farm gate to delivery, every step is recorded and visible.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Payments Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Payments</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Secure & Visible Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                No hidden fees. Track payment status in real-time. Automated settlements ensure you get paid on time, every time.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Final CTA */}
                <section className="text-center py-12 rounded-lg bg-secondary/20">
                    <h2 className="text-2xl font-bold mb-4">Ready to simplify your supply chain?</h2>
                    <Link to="/signup">
                        <Button size="lg">Join FarmBe Today</Button>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default Landing;
