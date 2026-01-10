import DashboardCard from "@/components/DashboardCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Bell, Calendar, FileText, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<"student" | "employee" | "staff" | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserName(parsed.fullname);
      setUserRole(parsed.role);
    }
  }, []);

  const recentApplications = [
    { id: "APP101", type: "New ID", status: "approved" as const, date: "2024-01-12" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Now using actual logged-in user */}
      <Navbar isLoggedIn={true} userRole={userRole} userName={userName} />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Employee Dashboard</h1>
            <p className="text-muted-foreground">Manage your ID and track contract status.</p>
          </div>

          {/* Contract Alert */}
          <Alert className="mb-6 border-warning bg-warning/10">
            <Calendar className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              Your contract expires in <strong>45 days</strong> (March 15, 2024). Please process renewal soon.
            </AlertDescription>
          </Alert>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
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
              title="Contract Info"
              description="View contract details"
              icon={Calendar}
              iconClassName="text-accent"
              onClick={() => navigate("/contract")}
            />
            <DashboardCard
              title="Notifications"
              description="View updates & alerts"
              icon={Bell}
              iconClassName="text-accent"
            >
              <div className="text-2xl font-bold">2</div>
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

export default EmployeeDashboard;
