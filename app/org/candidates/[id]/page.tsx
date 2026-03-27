"use client"
import { toast } from "sonner";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Briefcase, DollarSign, Clock, FileText, MessageSquare, Send, Building2, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { Badge } from "@/app/_components/ui/badge";
import { Separator } from "@/app/_components/ui/separator";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Skeleton } from "@/app/_components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/_components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select";
import { useRouter, useParams } from "next/navigation";
import { getDetailCandidate, updateCandidate, deleteCandidate } from "@/services/candidate.service";
import { getManpowerRequest } from "@/services/manpower_request.service";
import { createCandidateApplication } from "@/services/candidate-application.service";

interface CandidateDetail {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    birth_date: string;
    address: string;
    source: string;
    status: string;
    citizen_id?: string;
    created_at: string;
    updated_at: string;
}

interface ManpowerRequestOption {
    id: number;
    position: string;
    client?: { company_name: string };
}

export default function CandidateDetailPage() {
    const router = useRouter();
    const params = useParams();
    const candidateId = params.id as string;

    const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState("");
    const [manpowerRequests, setManpowerRequests] = useState<ManpowerRequestOption[]>([]);
    const [applyLoading, setApplyLoading] = useState(false);

    const fetchCandidate = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDetailCandidate(candidateId);
            setCandidate(res.data ?? res);
        } catch (error) {
            console.error("Failed to fetch candidate:", error);
        } finally {
            setLoading(false);
        }
    }, [candidateId]);

    useEffect(() => {
        fetchCandidate();
    }, [fetchCandidate]);

    const fetchManpowerRequests = async () => {
        try {
            const res = await getManpowerRequest({ limit: 100 });
            setManpowerRequests(res.data ?? []);
        } catch (error) {
            console.error("Failed to fetch manpower requests:", error);
        }
    };

    const handleOpenApplyDialog = () => {
        fetchManpowerRequests();
        setIsApplyDialogOpen(true);
    };

    const handleApplyToRequest = async () => {
        if (!selectedRequest || !candidate) return;
        setApplyLoading(true);
        try {
            await createCandidateApplication({
                candidate_id: candidate.id,
                manpower_request_id: Number(selectedRequest),
            });
            setIsApplyDialogOpen(false);
            setSelectedRequest("");
            toast.success("Candidate applied successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to apply candidate. Please try again.");
        } finally {
            setApplyLoading(false);
        }
    };

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: "", email: "", phone: "", birth_date: "", address: "", source: "", citizen_id: "",
    });

    const openEditDialog = () => {
        if (!candidate) return;
        setEditForm({
            full_name: candidate.full_name,
            email: candidate.email,
            phone: candidate.phone,
            birth_date: candidate.birth_date ? candidate.birth_date.split("T")[0] : "",
            address: candidate.address || "",
            source: candidate.source || "",
            citizen_id: candidate.citizen_id || "",
        });
        setEditDialogOpen(true);
    };

    const handleEdit = async () => {
        setEditLoading(true);
        try {
            await updateCandidate(candidateId, {
                full_name: editForm.full_name,
                email: editForm.email,
                phone: editForm.phone,
                birth_date: editForm.birth_date ? `${editForm.birth_date}T00:00:00Z` : undefined,
                address: editForm.address,
                source: editForm.source,
                citizen_id: editForm.citizen_id || undefined,
            });
            setEditDialogOpen(false);
            fetchCandidate();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update candidate.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Delete candidate "${candidate?.full_name}"? This cannot be undone.`)) return;
        try {
            await deleteCandidate(candidateId);
            router.push("/org/candidates");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete candidate.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case "AVAILABLE":
                return "bg-green-50 text-green-700 border-green-200";
            case "EMPLOYED":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "BLACKLISTED":
                return "bg-red-50 text-red-700 border-red-200";
            case "IN_PROCESS":
                return "bg-amber-50 text-amber-700 border-amber-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const onBack = () => {
        router.back();
    }

    if (loading) {
        return (
            <div className="px-8 py-8 space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div>
                        <Skeleton className="w-64 h-8 mb-2" />
                        <Skeleton className="w-96 h-5" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-96 rounded-xl" />
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="px-8 py-8 text-center">
                <p className="text-gray-500">Candidate not found.</p>
                <Button variant="outline" onClick={onBack} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-gray-900">{candidate.full_name}</h2>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(candidate.status)}`}>
                                {(candidate.status || "").replace("_", " ")}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {candidate.phone}
                            </span>
                            <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {candidate.email}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {candidate.address}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={openEditDialog}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                    <Button
                        onClick={handleOpenApplyDialog}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Apply to Request
                    </Button>
                </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pink-50 rounded-lg">
                            <Briefcase className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Source</p>
                            <p className="font-semibold text-gray-900">{candidate.source || "-"}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Birth Date</p>
                            <p className="font-semibold text-gray-900 text-sm">
                                {candidate.birth_date
                                    ? new Date(candidate.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-50 rounded-lg">
                            <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Citizen ID</p>
                            <p className="font-semibold text-gray-900 text-sm">{candidate.citizen_id || "-"}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Joined Pool</p>
                            <p className="font-semibold text-gray-900 text-sm">
                                {candidate.created_at
                                    ? new Date(candidate.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="space-y-8">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-pink-600" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                                <p className="font-medium text-gray-900">{candidate.full_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <p className="font-medium text-gray-900">{candidate.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Phone</p>
                                <p className="font-medium text-gray-900">{candidate.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Birth Date</p>
                                <p className="font-medium text-gray-900">
                                    {candidate.birth_date
                                        ? new Date(candidate.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Address</p>
                                <p className="font-medium text-gray-900">{candidate.address || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Source</p>
                                <p className="font-medium text-gray-900">{candidate.source || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Citizen ID</p>
                                <p className="font-medium text-gray-900">{candidate.citizen_id || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(candidate.status)}`}>
                                    {(candidate.status || "").replace("_", " ")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-pink-600" />
                            Contact Information
                        </h3>
                        <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{candidate.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{candidate.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{candidate.address || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Candidate Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Candidate</DialogTitle>
                        <DialogDescription>Update candidate information</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="edit-name">Full Name *</Label>
                            <Input id="edit-name" value={editForm.full_name}
                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-email">Email *</Label>
                                <Input id="edit-email" type="email" value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="edit-phone">Phone *</Label>
                                <Input id="edit-phone" value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="edit-birth">Birth Date</Label>
                                <Input id="edit-birth" type="date" value={editForm.birth_date}
                                    onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="edit-source">Source</Label>
                                <Input id="edit-source" value={editForm.source}
                                    onChange={(e) => setEditForm({ ...editForm, source: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="edit-address">Address</Label>
                            <Input id="edit-address" value={editForm.address}
                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                        </div>
                        <div>
                            <Label htmlFor="edit-citizen">Citizen ID</Label>
                            <Input id="edit-citizen" value={editForm.citizen_id}
                                onChange={(e) => setEditForm({ ...editForm, citizen_id: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit} disabled={!editForm.full_name || !editForm.email || editLoading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                            {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Apply to Request Dialog */}
            <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Apply to Manpower Request</DialogTitle>
                        <DialogDescription>
                            Select a manpower request to apply this candidate to
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Candidate</p>
                            <p className="font-semibold text-gray-900">{candidate.full_name}</p>
                            <p className="text-sm text-gray-600">{candidate.email}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-900 mb-2 block">
                                Select Manpower Request
                            </label>
                            <Select value={selectedRequest} onValueChange={setSelectedRequest}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a request..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {manpowerRequests.map((request) => (
                                        <SelectItem key={request.id} value={String(request.id)}>
                                            #{request.id} - {request.position} ({request.client?.company_name || "N/A"})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApplyToRequest}
                            disabled={!selectedRequest || applyLoading}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {applyLoading ? "Applying..." : "Apply Candidate"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
