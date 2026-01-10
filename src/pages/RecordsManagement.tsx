import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StaffSidebar from "@/components/StaffSidebar";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type StatusType = "submitted" | "under_review" | "approved" | "returned" | "rejected" | "expired";

type Application = {
  id: number;
  id_display: string; // App ID
  fullname: string;
  idno: string;
  department?: string | null;
  course?: string | null;
  status: StatusType;
  date: string; // YYYY-MM-DD
  photo?: string;
  signature?: string;
  cor?: string;
};

const RecordsManagement = () => {
  const [records, setRecords] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusType | "all">("all");
  const [loading, setLoading] = useState(false);

  // Fetch records from backend
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/applications");
      if (!res.ok) throw new Error("Failed to fetch records");
      const data: Application[] = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Delete record
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Application deleted");
      setRecords(records.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      r.fullname.toLowerCase().includes(query) ||
      r.idno.toLowerCase().includes(query) ||
      r.id_display.toLowerCase().includes(query);

    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn userRole="staff" userName="Admin User" />
      <div className="flex flex-1">
        <StaffSidebar />
        <main className="flex-1 bg-background p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Manage Records</h1>
            <p className="text-muted-foreground">Search, filter, and manage ID applications.</p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>List of student & employee ID applications</CardDescription>
            </CardHeader>

            <CardContent>
              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID number, or App ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val as any)}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-lg border border-border overflow-x-auto">
                {loading ? (
                  <p className="p-4 text-center text-muted-foreground">Loading records...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>App ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>ID Number</TableHead>
                        <TableHead>Department / Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredRecords.map((r) => (
                        <TableRow key={r.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{r.id_display}</TableCell>
                          <TableCell>{r.fullname}</TableCell>
                          <TableCell>{r.idno}</TableCell>
                          <TableCell>{r.department ?? r.course ?? "—"}</TableCell>
                          <TableCell>
                            <StatusBadge status={r.status} />
                          </TableCell>
                          <TableCell>{r.date}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => alert("Edit feature coming soon")}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 text-primary" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                  <DialogHeader>
                                    <DialogTitle>Uploaded Documents</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {r.photo && (
                                      <div>
                                        <p className="font-medium">2x2 Photo:</p>
                                        <img src={r.photo} alt="Photo" className="max-w-full rounded border" />
                                      </div>
                                    )}
                                    {r.signature && (
                                      <div>
                                        <p className="font-medium">E-Signature:</p>
                                        <img src={r.signature} alt="Signature" className="max-w-full rounded border" />
                                      </div>
                                    )}
                                    {r.cor && (
                                      <div>
                                        <p className="font-medium">COR:</p>
                                        <a href={r.cor} target="_blank" rel="noreferrer" className="text-primary underline">
                                          View COR
                                        </a>
                                      </div>
                                    )}
                                    {!r.photo && !r.signature && !r.cor && (
                                      <p className="text-muted-foreground">No documents uploaded.</p>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(r.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Showing {filteredRecords.length} of {records.length} applications
              </p>
            </CardContent>
          </Card>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default RecordsManagement;
