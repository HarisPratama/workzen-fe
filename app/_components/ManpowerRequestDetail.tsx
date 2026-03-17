import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Kanban
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {useRouter} from "next/navigation";
import {ManpowerRequest} from "@/app/_components/ManpowerRequestList";
import {Skeleton} from "@/app/_components/ui/skeleton";

interface ManpowerRequestDetailProps {
  onBack: () => void;
  manpowerRequest: ManpowerRequest;
  loading: boolean;
}

// Mock candidates data
const mockCandidates = [
  {
    id: "C-001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+62 812-3456-7890",
    status: "HIRED",
    stage: "Offer Accepted",
    appliedDate: "2026-02-22",
    lastUpdate: "2026-03-01",
  },
  {
    id: "C-002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+62 813-4567-8901",
    status: "HIRED",
    stage: "Onboarding",
    appliedDate: "2026-02-23",
    lastUpdate: "2026-03-02",
  },
  {
    id: "C-003",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+62 814-5678-9012",
    status: "HIRED",
    stage: "Started",
    appliedDate: "2026-02-25",
    lastUpdate: "2026-03-04",
  },
  {
    id: "C-004",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "+62 815-6789-0123",
    status: "INTERVIEWING",
    stage: "Technical Interview",
    appliedDate: "2026-02-28",
    lastUpdate: "2026-03-03",
  },
  {
    id: "C-005",
    name: "David Park",
    email: "david.park@email.com",
    phone: "+62 816-7890-1234",
    status: "SCREENING",
    stage: "Phone Screening",
    appliedDate: "2026-03-01",
    lastUpdate: "2026-03-02",
  },
];

// Mock activity log
const mockActivityLog = [
  {
    id: 1,
    action: "Candidate Hired",
    description: "Michael Chen accepted the offer and started onboarding",
    user: "Sarah Connor",
    timestamp: "2026-03-04 14:30",
  },
  {
    id: 2,
    action: "Interview Scheduled",
    description: "Technical interview scheduled for Sarah Williams",
    user: "Sarah Connor",
    timestamp: "2026-03-03 10:15",
  },
  {
    id: 3,
    action: "Candidate Hired",
    description: "Jane Smith accepted the offer",
    user: "Sarah Connor",
    timestamp: "2026-03-02 16:45",
  },
  {
    id: 4,
    action: "Candidate Added",
    description: "David Park added to pipeline",
    user: "Sarah Connor",
    timestamp: "2026-03-01 09:20",
  },
  {
    id: 5,
    action: "Candidate Hired",
    description: "John Doe successfully hired",
    user: "Sarah Connor",
    timestamp: "2026-03-01 11:00",
  },
  {
    id: 6,
    action: "Request Created",
    description: "Manpower request created for 5 Software Engineers",
    user: "Sarah Connor",
    timestamp: "2026-02-20 08:30",
  },
];

export function ManpowerRequestDetail({ onBack, manpowerRequest, loading }: ManpowerRequestDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("detail");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "FULFILLED":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getCandidateStatusColor = (status: string) => {
    switch (status) {
      case "HIRED":
        return "bg-green-50 text-green-700 border-green-200";
      case "INTERVIEWING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "SCREENING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const onViewCandidates = (id:string) => {
    router.push(`/org/manpower-request/pipelines/${id}`);
  }

  const onAddCandidate = () => {
    router.push(`/org/candidates/create`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {loading ?
            <Skeleton className={"w-5 h-5"}/>
              :
              <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
          }

          <div>
            <div className="flex items-center gap-3">
              {loading ?
                  <Skeleton className={"w-80 h-8"}/>
                  :
                  <h2 className="text-3xl font-bold text-gray-900">{manpowerRequest?.position}</h2>
              }
              {loading ?
                  <Skeleton className={"w-16 h-8"}/>
                  :
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(manpowerRequest?.status)}`}>
                    {manpowerRequest?.status === "IN_PROGRESS" ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    {manpowerRequest?.status.replace("_", " ")}
                  </div>
              }

            </div>
            {loading ?
                <Skeleton className={"w-16 h-4 mt-1"}/>
                :
                <p className="text-sm text-gray-600 mt-1">Request ID: {manpowerRequest?.id}</p>
            }
          </div>
        </div>

        <div className="flex gap-3">
          {loading ?
              <Skeleton className={"w-36 h-10 mt-1"}/>
              :
              <button
                  onClick={() => onViewCandidates("1")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-all font-medium"
              >
                <Kanban className="w-4 h-4" />
                View Pipeline
              </button>
          }
          {loading ?
              <Skeleton className={"w-36 h-10 mt-1"}/>
              :
              <button onClick={onAddCandidate} className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm">
                Add Candidate
              </button>
          }
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-50 rounded-lg">
              <Users className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">{manpowerRequest?.hired ?? 0}/{manpowerRequest?.required_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="text-lg font-bold text-gray-900">{manpowerRequest?.client?.company_name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Deadline</p>
              <p className="text-lg font-bold text-gray-900">
                {new Date(manpowerRequest?.deadline_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Salary Range</p>
              <p className="text-sm font-bold text-gray-900">
                {formatCurrency(manpowerRequest?.salary_min / 1000000)}M - {formatCurrency(manpowerRequest?.salary_max / 1000000)}M
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="detail" className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
            Detail
          </TabsTrigger>
          <TabsTrigger value="candidates" className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
            Candidates ({mockCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* Detail Tab */}
        <TabsContent value="detail" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-pink-600" />
                  Client & Location
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Client Name</p>
                    <p className="font-medium text-gray-900">{manpowerRequest.client.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {manpowerRequest.work_location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-pink-600" />
                  Salary Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Minimum Salary</p>
                    <p className="font-medium text-gray-900">{formatCurrency(manpowerRequest.salary_min)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Maximum Salary</p>
                    <p className="font-medium text-gray-900">{formatCurrency(manpowerRequest.salary_max)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{manpowerRequest.job_description}</p>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Request Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Created Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(manpowerRequest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Created By</p>
                    <p className="font-medium text-gray-900">{'-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Candidates Tab */}
        <TabsContent value="candidates">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Candidate</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Current Stage</TableHead>
                  <TableHead className="font-semibold">Applied Date</TableHead>
                  <TableHead className="font-semibold">Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{candidate.name}</p>
                        <p className="text-sm text-gray-600">{candidate.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {candidate.email}
                        </p>
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {candidate.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${getCandidateStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{candidate.stage}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{new Date(candidate.appliedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{new Date(candidate.lastUpdate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-0">
              {mockActivityLog.map((activity, index) => (
                <div
                  key={activity.id}
                  className="relative pl-8 pb-8 last:pb-0"
                >
                  {index !== mockActivityLog.length - 1 && (
                    <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-pink-600 border-2 border-white shadow"></div>
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
