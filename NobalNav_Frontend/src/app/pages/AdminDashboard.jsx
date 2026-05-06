import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Calendar, Users, CheckCircle, Clock, LogOut, Search, Download } from "lucide-react";
import { toast } from "sonner";
import api from "../../api";

// FIX: Accept setIsLoggedIn prop so logout properly clears React state
export default function AdminDashboard({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchBookings();
  }, [navigate]);

  // FIX: Use the shared api axios instance (handles token automatically)
  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/appointments/all");
      setBookings(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin");
        return;
      }
      toast.error("Failed to load bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data: updated } = await api.patch(`/appointments/${id}/status`, { status: newStatus });
      setBookings((prev) => prev.map((b) => (b._id === id ? updated : b)));
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // clears the httpOnly cookie on the server
    } catch { /* ignore errors, logout anyway */ }
    localStorage.removeItem("adminUser");
    if (setIsLoggedIn) setIsLoggedIn(false);
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { icon: Calendar, label: "Total Bookings", value: bookings.length.toString(), color: "bg-blue-100 text-blue-600" },
    { icon: Clock, label: "Pending", value: bookings.filter((b) => b.status === "pending").length.toString(), color: "bg-yellow-100 text-yellow-600" },
    { icon: CheckCircle, label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length.toString(), color: "bg-green-100 text-green-600" },
    { icon: Users, label: "Completed", value: bookings.filter((b) => b.status === "completed").length.toString(), color: "bg-purple-100 text-purple-600" },
  ];

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Date", "Time", "Service", "Status"];
    const rows = filteredBookings.map((b) => [b._id, b.name, b.email, b.phone, b.date, b.time, b.service, b.status]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl text-blue-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Nobal Navigator Pvt Ltd</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl text-blue-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading bookings...</div>
            ) : (
              <Tabs defaultValue="all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <TabsList>
                    <TabsTrigger value="all" onClick={() => setFilterStatus("all")}>All Bookings</TabsTrigger>
                    <TabsTrigger value="pending" onClick={() => setFilterStatus("pending")}>Pending</TabsTrigger>
                    <TabsTrigger value="confirmed" onClick={() => setFilterStatus("confirmed")}>Confirmed</TabsTrigger>
                    <TabsTrigger value="completed" onClick={() => setFilterStatus("completed")}>Completed</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                    </div>
                    <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <TabsContent value="all" className="mt-0">
                  <BookingsTable bookings={filteredBookings} getStatusBadge={getStatusBadge} onStatusChange={handleStatusChange} />
                </TabsContent>
                <TabsContent value="pending" className="mt-0">
                  <BookingsTable bookings={filteredBookings} getStatusBadge={getStatusBadge} onStatusChange={handleStatusChange} />
                </TabsContent>
                <TabsContent value="confirmed" className="mt-0">
                  <BookingsTable bookings={filteredBookings} getStatusBadge={getStatusBadge} onStatusChange={handleStatusChange} />
                </TabsContent>
                <TabsContent value="completed" className="mt-0">
                  <BookingsTable bookings={filteredBookings} getStatusBadge={getStatusBadge} onStatusChange={handleStatusChange} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl text-blue-900 mb-4">Recent Bookings</h3>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{booking.name}</div>
                        <div className="text-sm text-gray-500">
                          {booking.service} • {new Date(booking.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(booking.status)}>{booking.status}</Badge>
                  </div>
                ))}
                {bookings.length === 0 && !isLoading && (
                  <p className="text-center text-gray-500 py-4">No bookings yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BookingsTable({ bookings, getStatusBadge, onStatusChange }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">No bookings found</TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  <div className="font-medium">{booking.name}</div>
                  <div className="text-sm text-gray-500">{booking.educationLevel}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{booking.email}</div>
                  <div className="text-sm text-gray-500">{booking.phone}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(booking.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">{booking.time}</div>
                </TableCell>
                <TableCell><div className="text-sm max-w-xs">{booking.service}</div></TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(booking.status)}>{booking.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    {booking.status === "pending" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        onClick={() => onStatusChange(booking._id, "confirmed")}>
                        Confirm
                      </Button>
                    )}
                    {booking.status === "confirmed" && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        onClick={() => onStatusChange(booking._id, "completed")}>
                        Complete
                      </Button>
                    )}
                    {booking.status !== "cancelled" && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                        onClick={() => onStatusChange(booking._id, "cancelled")}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}