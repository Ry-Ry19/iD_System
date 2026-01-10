import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: "Apply for ID",
      description: "Submit your ID application with all required documents online.",
    },
    {
      icon: RefreshCw,
      title: "Revalidate ID",
      description: "Quick and easy ID revalidation process for current users.",
    },
    {
      icon: BarChart3,
      title: "Track Status",
      description: "Monitor your application status in real-time with detailed updates.",
    },
    {
      icon: Clock,
      title: "Contract Monitoring",
      description: "Employees can track contract expiration and receive timely reminders.",
    },
    {
      icon: CheckCircle,
      title: "Fast Approval",
      description: "Streamlined review process ensures quick application turnaround.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security measures.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative gradient-hero py-20 md:py-32 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Welcome to IDLink
          </h1>
          <p className="mb-8 text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            MSU-IIT's centralized ID processing and management system. Apply, revalidate,
            and track your ID applications with ease.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild className="gradient-gold text-accent-foreground font-semibold">
              <Link to="/login">Login</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
              <Link to="/login">Apply for ID</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
              <Link to="/login">Track Status</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Submit Application</h3>
              <p className="text-muted-foreground">
                Fill out the online form and upload required documents.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Review Process</h3>
              <p className="text-muted-foreground">
                ICTC staff reviews and verifies your application details.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Get Your ID</h3>
              <p className="text-muted-foreground">
                Receive approval notification and collect your ID card.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-card hover:shadow-hover transition-smooth">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of MSU-IIT students and employees using IDLink.
          </p>
          <Button size="lg" variant="secondary" asChild className="gradient-gold text-accent-foreground font-semibold">
            <Link to="/login">Apply Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
            <Link to="/team">Meet the Team</Link>
          </Button>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
