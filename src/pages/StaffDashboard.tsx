import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StaffSidebar from "@/components/StaffSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<"student" | "employee" | "staff" | null>(null);

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);
    setUserName(parsed.fullname);
    setUserRole(parsed.role);

    // ❗ Prevent students/employees from accessing staff dashboard
    if (parsed.role !== "staff") {
      navigate("/");
    }
  }, [navigate]);

  const stats = [
    { title: "Pending Applications", value: "24", icon: Clock, color: "text-warning" },
    { title: "Approved Today", value: "18", icon: CheckCircle, color: "text-success" },
    { title: "Returned Applications", value: "5", icon: XCircle, color: "text-destructive" },
    { title: "Total Users", value: "1,248", icon: Users, color: "text-info" },
  ];

  const recentActivity = [
    { id: "APP205", applicant: "Juan Dela Cruz", action: "Submitted", time: "5 mins ago" },
    { id: "APP204", applicant: "Maria Santos", action: "Approved", time: "15 mins ago" },
    { id: "APP203", applicant: "Pedro Garcia", action: "Returned", time: "1 hour ago" },
    { id: "APP202", applicant: "Ana Lopez", action: "Submitted", time: "2 hours ago" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn userRole={userRole} userName={userName} />

      <div className="flex flex-1">
        <StaffSidebar />

        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">ICTC Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage ID applications system-wide.</p>
            </div>

            {/* Statistics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title} className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-base"
                    >
                      <div>
                        <p className="font-semibold">{activity.id}</p>
                        <p className="text-sm text-muted-foreground">{activity.applicant}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StaffDashboard;
