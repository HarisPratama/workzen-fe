import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Kanban,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Combobox } from "./ui/combobox";
import { useRouter } from "next/navigation";
import { ManpowerRequest } from "@/app/_components/ManpowerRequestList";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { getCandidatesForManpowerRequest, createCandidateApplication } from "@/services/candidate-application.service";
import { getCandidates } from "@/services/candidate.service";
import { updateManpowerRequest, deleteManpowerRequest } from "@/services/manpower_request.service";
import { getListClient } from "@/services/client.service";
import { useFetch } from "@/hooks/use-fetch";
import { ConfirmDialog } from "@/app/_components/ConfirmDialog";

interface ManpowerRequestDetailProps {
  onBack: () => void;
  manpowerRequest: ManpowerRequest;
  loading: boolean;
  onRefetch?: () => void;
}

interface CandidateApplication {
  id: number;
  candidate?: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
  };
  status: string;
  stage: string;
  created_at: string;
  updated_at: string;
}

export function ManpowerRequestDetail({ onBack, manpowerRequest, loading, onRefetch }: ManpowerRequestDetailProps) {
  const router = useRouter();
  const { can } = useAuth();
  const [activeTab, setActiveTab] = useState("detail");
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [addCandidateLoading, setAddCandidateLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    client_id: "", position: "", required_count: "", salary_min: "", salary_max: "",
    work_location: "", job_description: "", deadline_date: "",
  });

  const { data: clientData, loading: clientLoading } = useFetch(
    () => getListClient({ limit: 100 }), []
  );

  const clientOptions = (clientData?.data ?? []).map((c: { id: number; company_name: string }) => ({
    value: String(c.id),
    label: c.company_name,
    sublabel: `ID: ${c.id}`,
  }));

  const openEditDialog = () => {
    if (!manpowerRequest) return;
    setEditForm({
      client_id: String(manpowerRequest.client_id ?? ""),
      position: manpowerRequest.position,
      required_count: String(manpowerRequest.required_count),
      salary_min: String(manpowerRequest.salary_min),
      salary_max: String(manpowerRequest.salary_max),
      work_location: manpowerRequest.work_location,
      job_description: manpowerRequest.job_description,
      deadline_date: manpowerRequest.deadline_date ? manpowerRequest.deadline_date.split("T")[0] : "",
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    try {
      await updateManpowerRequest(String(manpowerRequest.id), {
        client_id: Number(editForm.client_id),
        position: editForm.position,
        required_count: Number(editForm.required_count),
        salary_min: Number(editForm.salary_min),
        salary_max: Number(editForm.salary_max),
        work_location: editForm.work_location,
        job_description: editForm.job_description,
        deadline_date: editForm.deadline_date ? `${editForm.deadline_date}T00:00:00Z` : undefined,
      });
      setEditOpen(false);
      onRefetch?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update manpower request.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await deleteManpowerRequest(String(manpowerRequest.id));
      router.push("/org/manpower-request");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete manpower request.");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const { data: candidateListData, loading: candidateListLoading } = useFetch(
    () => getCandidates({ limit: 100 }), []
  );

  const candidateOptions = (candidateListData?.data ?? []).map((c: { id: number; full_name: string; email: string }) => ({
    value: String(c.id),
    label: c.full_name,
    sublabel: c.email,
  }));

  useEffect(() => {
    if (manpowerRequest?.id && activeTab === "candidates") {
      fetchCandidates();
    }
  }, [manpowerRequest?.id, activeTab]);

  const fetchCandidates = async () => {
    if (!manpowerRequest?.id) return;
    setCandidatesLoading(true);
    try {
      const res = await getCandidatesForManpowerRequest(String(manpowerRequest.id));
      setCandidates(res.data ?? []);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  };

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
    switch (status?.toUpperCase()) {
      case "HIRED":
        return "bg-green-50 text-green-700 border-green-200";
      case "INTERVIEWING":
      case "INTERVIEW":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "SCREENING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "OFFERED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "APPLIED":
        return "bg-gray-50 text-gray-700 border-gray-200";
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

  const onViewCandidates = (id: string) => {
    router.push(`/org/manpower-request/pipelines/${id}`);
  }

  const handleAddCandidate = async () => {
    if (!selectedCandidateId || !manpowerRequest?.id) return;
    setAddCandidateLoading(true);
    try {
      await createCandidateApplication({
        candidate_id: Number(selectedCandidateId),
        manpower_request_id: Number(manpowerRequest.id),
      });
      setAddCandidateOpen(false);
      setSelectedCandidateId("");
      fetchCandidates();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to add candidate to this request.");
    } finally {
      setAddCandidateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {loading ?
            <Skeleton className={"w-5 h-5"} />
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
                <Skeleton className={"w-80 h-8"} />
                :
                <h2 className="text-3xl font-bold text-gray-900">{manpowerRequest?.position}</h2>
              }
              {loading ?
                <Skeleton className={"w-16 h-8"} />
                :
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(manpowerRequest?.status)}`}>
                  {manpowerRequest?.status === "IN_PROGRESS" ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                  {manpowerRequest?.status?.replace("_", " ")}
                </div>
              }
            </div>
            {loading ?
              <Skeleton className={"w-16 h-4 mt-1"} />
              :
              <p className="text-sm text-gray-600 mt-1">Request ID: {manpowerRequest?.id}</p>
            }
          </div>
        </div>

        <div className="flex gap-3">
          {!loading && (
            <>
              {can("manpower-request:edit") && (
                <Button variant="outline" onClick={openEditDialog}>
                  <Edit className="w-4 h-4 mr-2" />Edit
                </Button>
              )}
              {can("manpower-request:delete") && (
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteConfirmOpen(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />Delete
                </Button>
              )}
              <button
                onClick={() => onViewCandidates(String(manpowerRequest?.id))}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-all font-medium"
              >
                <Kanban className="w-4 h-4" />
                View Pipeline
              </button>
              <button onClick={() => setAddCandidateOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm">
                <Plus className="w-4 h-4" />
                Add Candidate
              </button>
            </>
          )
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
            Candidates ({candidates.length})
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
                  <TableHead className="font-semibold">Applied Date</TableHead>
                  <TableHead className="font-semibold">Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidatesLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="w-32 h-5" /></TableCell>
                      <TableCell><Skeleton className="w-40 h-5" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-5" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-5" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-5" /></TableCell>
                    </TableRow>
                  ))
                ) : candidates.length > 0 ? (
                  candidates.map((application) => (
                    <TableRow key={application.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{application.candidate?.full_name || "-"}</p>
                          <p className="text-sm text-gray-600">ID: {application.candidate?.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {application.candidate?.email || "-"}
                          </p>
                          <p className="text-sm text-gray-900 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {application.candidate?.phone || "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${getCandidateStatusColor(application.status)}`}>
                          {(application.status || "").replace("_", " ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-900">
                          {application.created_at
                            ? new Date(application.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                            : "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-900">
                          {application.updated_at
                            ? new Date(application.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                            : "-"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                      No candidates applied yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Manpower Request Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Manpower Request</DialogTitle>
            <DialogDescription>Update the manpower request details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Client *</Label>
              <Combobox
                options={clientOptions}
                value={editForm.client_id}
                onValueChange={(v) => setEditForm({ ...editForm, client_id: v })}
                placeholder="Select client..."
                searchPlaceholder="Search client..."
                emptyText="No clients found."
                loading={clientLoading}
              />
            </div>
            <div>
              <Label htmlFor="edit-position">Position *</Label>
              <Input id="edit-position" value={editForm.position}
                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-count">Required Count *</Label>
                <Input id="edit-count" type="number" value={editForm.required_count}
                  onChange={(e) => setEditForm({ ...editForm, required_count: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edit-deadline">Deadline *</Label>
                <Input id="edit-deadline" type="date" value={editForm.deadline_date}
                  onChange={(e) => setEditForm({ ...editForm, deadline_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-salmin">Salary Min</Label>
                <Input id="edit-salmin" type="number" value={editForm.salary_min}
                  onChange={(e) => setEditForm({ ...editForm, salary_min: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="edit-salmax">Salary Max</Label>
                <Input id="edit-salmax" type="number" value={editForm.salary_max}
                  onChange={(e) => setEditForm({ ...editForm, salary_max: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-location">Work Location</Label>
              <Input id="edit-location" value={editForm.work_location}
                onChange={(e) => setEditForm({ ...editForm, work_location: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="edit-jd">Job Description</Label>
              <Textarea id="edit-jd" rows={4} value={editForm.job_description}
                onChange={(e) => setEditForm({ ...editForm, job_description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}
              disabled={!editForm.position || !editForm.client_id || editLoading}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Candidate Dialog */}
      <Dialog open={addCandidateOpen} onOpenChange={setAddCandidateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              Select a candidate from the talent pool to apply for this position
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Candidate *</Label>
            <Combobox
              options={candidateOptions}
              value={selectedCandidateId}
              onValueChange={setSelectedCandidateId}
              placeholder="Select candidate..."
              searchPlaceholder="Search candidate name..."
              emptyText="No candidates found."
              loading={candidateListLoading}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCandidateOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddCandidate}
              disabled={!selectedCandidateId || addCandidateLoading}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
            >
              {addCandidateLoading ? "Adding..." : "Add Candidate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Manpower Request"
        description="Are you sure you want to delete this manpower request? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteRequest}
      />
    </div>
  );
}
