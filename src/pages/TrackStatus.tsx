import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { CheckCircle, Circle, Clock } from "lucide-react";

const TrackStatus = () => {
  const applications = [
    {
      id: "APP001",
      type: "New ID Application",
      status: "under_review" as const,
      submittedDate: "2024-01-15",
      remarks: "All documents received. Under review by ICTC staff.",
      timeline: [
        { label: "Submitted", date: "2024-01-15", completed: true },
        { label: "Under Review", date: "2024-01-16", completed: true },
        { label: "Approved", date: null, completed: false },
        { label: "Ready for Pickup", date: null, completed: false },
      ],
    },
    {
      id: "APP002",
      type: "ID Revalidation",
      status: "approved" as const,
      submittedDate: "2024-01-10",
      remarks: "Approved. ID ready for pickup at ICTC office.",
      timeline: [
        { label: "Submitted", date: "2024-01-10", completed: true },
        { label: "Under Review", date: "2024-01-11", completed: true },
        { label: "Approved", date: "2024-01-12", completed: true },
        { label: "Ready for Pickup", date: "2024-01-13", completed: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Track Application Status</h1>
            <p className="text-muted-foreground">Monitor the progress of your ID applications.</p>
          </div>

          <div className="space-y-6">
            {applications.map((app) => (
              <Card key={app.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{app.type}</CardTitle>
                      <CardDescription>Application ID: {app.id}</CardDescription>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted Date</p>
                      <p className="font-semibold">{app.submittedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Status</p>
                      <p className="font-semibold capitalize">{app.status.replace("_", " ")}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Remarks</p>
                    <p className="text-sm">{app.remarks}</p>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-sm font-semibold mb-4">Application Timeline</p>
                    <div className="space-y-4">
                      {app.timeline.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            {step.completed ? (
                              <CheckCircle className="h-6 w-6 text-success" />
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground" />
                            )}
                            {index < app.timeline.length - 1 && (
                              <div className={`w-0.5 h-12 ${step.completed ? "bg-success" : "bg-border"}`} />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                              {step.label}
                            </p>
                            {step.date && (
                              <p className="text-sm text-muted-foreground">{step.date}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackStatus;
