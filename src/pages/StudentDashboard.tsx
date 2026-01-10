import DashboardCard from "@/components/DashboardCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Bell, FileText, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  fullname: string;
  role: string;
  idno: string;
  email: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user is logged in, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const recentApplications = [
    { id: "APP001", type: "New ID", status: "under_review" as const, date: "2024-01-15" },
    { id: "APP002", type: "Revalidation", status: "approved" as const, date: "2024-01-10" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isLoggedIn={!!user}
        userRole={(user?.role as "student" | "employee" | "staff") || "student"}
        userName={user?.fullname || ""}
      />

      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back{user ? `, ${user.fullname}` : ""}! Manage your ID applications here.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <DashboardCard
              title="Apply for ID"
              description="Submit new ID application"
              icon={FileText}
              onClick={() => navigate("/apply")}
            />
            <DashboardCard
              title="Revalidate ID"
              description="Renew your existing ID"
              icon={RefreshCw}
              onClick={() => navigate("/revalidate")}
            />
            <DashboardCard
              title="Track Status"
              description="Check application status"
              icon={BarChart3}
              onClick={() => navigate("/track")}
            />
            <DashboardCard
              title="Notifications"
              description="View updates & alerts"
              icon={Bell}
              iconClassName="text-accent"
            >
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">New notifications</p>
            </DashboardCard>
          </div>

          {/* Recent Applications */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-base cursor-pointer"
                    onClick={() => navigate("/track")}
                  >
                    <div>
                      <p className="font-semibold">{app.id}</p>
                      <p className="text-sm text-muted-foreground">{app.type}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={app.status} />
                      <p className="text-xs text-muted-foreground mt-1">{app.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
