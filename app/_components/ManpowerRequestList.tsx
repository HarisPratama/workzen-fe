"use client"
import { Search, Filter, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import {useEffect, useState} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import {useRouter} from "next/navigation";
import {getManpowerRequest} from "@/services/manpower_request.service"

export interface ManpowerRequest {
  id: string;
  client: {
    company_name: string;
  };
  position: string;
  required_count: number;
  salary_min: number;
  salary_max: number;
  hired: number;
  status: "OPEN" | "IN_PROGRESS" | "FILLED" | "CANCELLED";
  deadline_date: string;
  work_location: string;
  job_description: string;
  created_at: string;
}

interface ManpowerRequestListProps {
  manpowerRequests: ManpowerRequest[];
}

// Mock data
const mockRequests: any[] = [
  {
    id: "MPR-001",
    client: "PT Maju Jaya",
    position: "Software Engineer",
    required_count: 5,
    hired: 3,
    status: "IN_PROGRESS",
    deadline_date: "2026-04-15",
  },
  {
    id: "MPR-002",
    client: "CV Sukses Mandiri",
    position: "Marketing Manager",
    required_count: 2,
    hired: 2,
    status: "FILLED",
    deadline_date: "2026-03-20",
  },
  {
    id: "MPR-003",
    client: "PT Global Tech",
    position: "Data Analyst",
    required_count: 3,
    hired: 0,
    status: "OPEN",
    deadline_date: "2026-05-01",
  },
  {
    id: "MPR-004",
    client: "PT Sejahtera Abadi",
    position: "UI/UX Designer",
    required_count: 4,
    hired: 1,
    status: "IN_PROGRESS",
    deadline_date: "2026-04-28",
  },
  {
    id: "MPR-005",
    client: "CV Karya Bersama",
    position: "HR Specialist",
    required_count: 2,
    hired: 0,
    status: "OPEN",
    deadline_date: "2026-05-10",
  },
  {
    id: "MPR-006",
    client: "PT Global Tech",
    position: "DevOps Engineer",
    required_count: 3,
    hired: 0,
    status: "CANCELLED",
    deadline_date: "2026-03-15",
  },
];

export function ManpowerRequestList() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [manpowerRequests, setManpowerRequests] = useState<ManpowerRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const fetchManpowerRequests = async () => {
    try {
      setLoading(true);

      const resp = await getManpowerRequest({search: searchQuery});

      if (resp?.data) {
        setManpowerRequests(resp.data);
      }
    } catch (error) {
      console.error("Failed to fetch manpower requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    fetchManpowerRequests();
  }, [debouncedSearch]);


  const handleCreateNew = () => {
    router.push("/org/manpower-request/create");
  };

  const handleViewDetail = (id: string) => {
    router.push(`/org/manpower-request/${id}`);
  };

  const getStatusIcon = (status: ManpowerRequest["status"]) => {
    switch (status) {
      case "OPEN":
        return <Clock className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <AlertCircle className="w-4 h-4" />;
      case "FILLED":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ManpowerRequest["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "FILLED":
        return "bg-green-50 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: ManpowerRequest["status"]) => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "FILLED":
        return "Filled";
      case "CANCELLED":
        return "Cancelled";
    }
  };

  const uniqueClients = Array.from(new Set(mockRequests.map((r) => r.client)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manpower Requests</h2>
          <p className="text-sm text-gray-600 mt-1">Manage client manpower requirements and hiring progress</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Request
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by client, position, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="FILLED">Filled</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Client Filter */}
          <div>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {uniqueClients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Request ID</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Position</TableHead>
              <TableHead className="font-semibold text-center">Required</TableHead>
              <TableHead className="font-semibold text-center">Hired</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manpowerRequests?.map((request) => (
              <TableRow
                key={request.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleViewDetail(request.id)}
              >
                <TableCell className="font-medium text-pink-600">{request.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{request.client.company_name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-gray-900">{request.position}</p>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full font-semibold text-gray-900">
                    {request.required_count}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full font-semibold text-green-700">
                    {request.hired}
                  </span>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {getStatusLabel(request.status)}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-gray-900">{new Date(request.deadline_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {manpowerRequests.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No requests found matching your filters</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>Showing {manpowerRequests.length} of {mockRequests.length} requests</p>
      </div>
    </div>
  );
}
