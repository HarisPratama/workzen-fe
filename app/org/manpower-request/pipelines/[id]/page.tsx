"use client"
import { toast } from "sonner";
import {
    ArrowLeft,
    Phone,
    Mail,
    Calendar,
    MapPin,
    Briefcase,
    FileText,
    MessageSquare,
    Video,
    CheckCircle,
    Clock,
    Plus,
    X,
    Send,
    DollarSign
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/app/_components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/_components/ui/dialog";
import { Badge } from "@/app/_components/ui/badge";
import { Label } from "@/app/_components/ui/label";
import { Separator } from "@/app/_components/ui/separator";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { Combobox } from "@/app/_components/ui/combobox";
import { useParams, useRouter } from "next/navigation";
import { ScheduleInterviewModal } from "@/app/_components/ScheduleInterviewModal";
import { CreateOfferModal } from "@/app/_components/CreateOfferModal";
import { OfferDecisionModal } from "@/app/_components/OfferDecisionModal";
import { InterviewResultModal } from "@/app/_components/InterviewResultModal";
import { getCandidatesForManpowerRequest, createCandidateApplication, updateCandidateApplication } from "@/services/candidate-application.service";
import { getCandidates } from "@/services/candidate.service";
import { getInterviews } from "@/services/interview.service";
import { getOffers } from "@/services/offer.service";
import { useFetch } from "@/hooks/use-fetch";

type CandidateStatus = "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFERED" | "HIRED";

interface Candidate {
    id: number;
    candidate_application_id?: number;
    name: string;
    email: string;
    phone: string;
    status: CandidateStatus;
    appliedDate: string;
    lastActivity: string;
    position: string;
}

const ITEM_TYPE = "CANDIDATE";

const COLUMNS: { id: CandidateStatus; title: string; color: string }[] = [
    { id: "APPLIED", title: "Applied", color: "bg-gray-100" },
    { id: "SCREENING", title: "Screening", color: "bg-blue-100" },
    { id: "INTERVIEW", title: "Interview", color: "bg-amber-100" },
    { id: "OFFERED", title: "Offered", color: "bg-purple-100" },
    { id: "HIRED", title: "Hired", color: "bg-green-100" },
];

interface CandidateCardProps {
    candidate: Candidate;
    onClick: () => void;
}

function CandidateCard({ candidate, onClick }: CandidateCardProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ITEM_TYPE,
        item: { id: candidate.id, currentStatus: candidate.status },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag as unknown as React.Ref<HTMLDivElement>}
            onClick={onClick}
            className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow ${
                isDragging ? "opacity-50" : ""
            }`}
        >
            <div className="space-y-3">
                <div>
                    <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                    <p className="text-sm text-gray-600">{candidate.position}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {candidate.phone}
                    </p>
                    <p className="text-xs text-gray-500">Applied: {candidate.appliedDate}</p>
                </div>
            </div>
        </div>
    );
}

interface KanbanColumnProps {
    column: { id: CandidateStatus; title: string; color: string };
    candidates: Candidate[];
    onCandidateClick: (candidate: Candidate) => void;
    onDrop: (candidateId: number, fromStatus: CandidateStatus, toStatus: CandidateStatus) => void;
}

function KanbanColumn({ column, candidates, onCandidateClick, onDrop }: KanbanColumnProps) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ITEM_TYPE,
        drop: (item: { id: number; currentStatus: CandidateStatus }) => {
            if (item.currentStatus !== column.id) {
                onDrop(item.id, item.currentStatus, column.id);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop as unknown as React.Ref<HTMLDivElement>}
            className={`flex-1 min-w-[280px] ${isOver ? "bg-pink-50" : ""} rounded-lg transition-colors`}
        >
            <div className="mb-4">
                <div className={`${column.color} rounded-lg px-4 py-3`}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{column.title}</h3>
                        <span className="text-sm font-semibold text-gray-700 bg-white rounded-full w-6 h-6 flex items-center justify-center">
                            {candidates.length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 min-h-[200px]">
                {candidates.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onClick={() => onCandidateClick(candidate)}
                    />
                ))}
            </div>
        </div>
    );
}

interface InterviewData {
    id: number;
    type: string;
    scheduled_at: string;
    duration_minutes: number;
    status?: string;
    result?: string;
    location?: string;
    meeting_link?: string;
    interviewer?: { id: number; name: string };
}

interface OfferData {
    id: number;
    position: string;
    base_salary: number;
    status: string;
    employment_type?: string;
    start_date?: string;
    expiry_date?: string;
    created_at: string;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);

export default function CandidatePipeline() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        candidateId: number;
        fromStatus: CandidateStatus;
        toStatus: CandidateStatus;
    } | null>(null);

    const [scheduleInterviewModalOpen, setScheduleInterviewModalOpen] = useState(false);
    const [interviewResultModalOpen, setInterviewResultModalOpen] = useState(false);
    const [createOfferModalOpen, setCreateOfferModalOpen] = useState(false);
    const [offerDecisionModalOpen, setOfferDecisionModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<{
        id?: number;
        decision?: string;
        candidateName?: string;
        position?: string;
    } | null>(null);

    // Add candidate dialog
    const [addCandidateOpen, setAddCandidateOpen] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState("");
    const [addCandidateLoading, setAddCandidateLoading] = useState(false);

    // Drawer data
    const [candidateInterviews, setCandidateInterviews] = useState<InterviewData[]>([]);
    const [candidateOffers, setCandidateOffers] = useState<OfferData[]>([]);
    const [interviewsLoading, setInterviewsLoading] = useState(false);
    const [offersLoading, setOffersLoading] = useState(false);

    const { data: candidateListData, loading: candidateListLoading } = useFetch(
        () => getCandidates({ limit: 100 }), []
    );

    const candidateOptions = (candidateListData?.data ?? []).map((c: { id: number; full_name: string; email: string }) => ({
        value: String(c.id),
        label: c.full_name,
        sublabel: c.email,
    }));

    const fetchCandidates = useCallback(async () => {
        if (!params.id) return;
        setLoading(true);
        try {
            const res = await getCandidatesForManpowerRequest(params.id);
            const data = res.data ?? [];

            const mapped: Candidate[] = data.map((app: {
                id: number;
                candidate?: { id: number; full_name: string; email: string; phone: string };
                status?: string;
                created_at?: string;
                updated_at?: string;
            }) => ({
                id: app.candidate?.id ?? app.id,
                candidate_application_id: app.id,
                name: app.candidate?.full_name ?? "-",
                email: app.candidate?.email ?? "-",
                phone: app.candidate?.phone ?? "-",
                status: (app.status?.toUpperCase() as CandidateStatus) || "APPLIED",
                appliedDate: app.created_at
                    ? new Date(app.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                    : "-",
                lastActivity: app.updated_at
                    ? new Date(app.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                    : "-",
                position: "Candidate",
            }));

            setCandidates(mapped);
        } catch (error) {
            console.error("Failed to fetch pipeline candidates:", error);
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const handleCandidateClick = async (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setIsDrawerOpen(true);
        setCandidateInterviews([]);
        setCandidateOffers([]);

        // Fetch interviews for this candidate application
        if (candidate.candidate_application_id) {
            setInterviewsLoading(true);
            try {
                const res = await getInterviews({ limit: 50 });
                const allInterviews = res.data ?? [];
                const filtered = allInterviews.filter(
                    (i: { candidate_application_id?: number }) =>
                        i.candidate_application_id === candidate.candidate_application_id
                );
                setCandidateInterviews(filtered);
            } catch {
                setCandidateInterviews([]);
            } finally {
                setInterviewsLoading(false);
            }

            // Fetch offers for this candidate application
            setOffersLoading(true);
            try {
                const res = await getOffers({ limit: 50 });
                const allOffers = res.data ?? [];
                const filtered = allOffers.filter(
                    (o: { candidate_application_id?: number }) =>
                        o.candidate_application_id === candidate.candidate_application_id
                );
                setCandidateOffers(filtered);
            } catch {
                setCandidateOffers([]);
            } finally {
                setOffersLoading(false);
            }
        }
    };

    const handleDrop = (candidateId: number, fromStatus: CandidateStatus, toStatus: CandidateStatus) => {
        setConfirmDialog({
            open: true,
            candidateId,
            fromStatus,
            toStatus,
        });
    };

    const confirmStatusChange = async () => {
        if (!confirmDialog) return;

        const candidate = candidates.find(c => c.id === confirmDialog.candidateId);
        if (!candidate?.candidate_application_id) {
            setConfirmDialog(null);
            return;
        }

        // Optimistic update
        setCandidates((prev) =>
            prev.map((c) =>
                c.id === confirmDialog.candidateId
                    ? { ...c, status: confirmDialog.toStatus }
                    : c
            )
        );

        if (selectedCandidate && selectedCandidate.id === confirmDialog.candidateId) {
            setSelectedCandidate({ ...selectedCandidate, status: confirmDialog.toStatus });
        }

        try {
            await updateCandidateApplication(candidate.candidate_application_id, {
                status: confirmDialog.toStatus,
            });
        } catch (err) {
            console.error(err);
            // Revert on failure
            setCandidates((prev) =>
                prev.map((c) =>
                    c.id === confirmDialog.candidateId
                        ? { ...c, status: confirmDialog.fromStatus }
                        : c
                )
            );
            toast.error(err instanceof Error ? err.message : "Failed to update candidate status.");
        }

        setConfirmDialog(null);
    };

    const getCandidatesByStatus = (status: CandidateStatus) => {
        return candidates.filter((c) => c.status === status);
    };

    const onBack = () => {
        router.back();
    };

    const handleAddCandidate = async () => {
        if (!selectedCandidateId || !params.id) return;
        setAddCandidateLoading(true);
        try {
            await createCandidateApplication({
                candidate_id: Number(selectedCandidateId),
                manpower_request_id: Number(params.id),
            });
            setAddCandidateOpen(false);
            setSelectedCandidateId("");
            fetchCandidates();
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to add candidate.");
        } finally {
            setAddCandidateLoading(false);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
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
                            <h2 className="text-3xl font-bold text-gray-900">Candidate Pipeline</h2>
                            <p className="text-sm text-gray-600 mt-1">Request ID: {params.id}</p>
                        </div>
                    </div>

                    <button onClick={() => setAddCandidateOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm">
                        <Plus className="w-4 h-4" />
                        Add Candidate
                    </button>
                </div>

                {/* Kanban Board */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    {loading ? (
                        <div className="flex gap-4">
                            {COLUMNS.map((col) => (
                                <div key={col.id} className="flex-1 min-w-[280px]">
                                    <Skeleton className="h-12 rounded-lg mb-4" />
                                    <div className="space-y-3">
                                        <Skeleton className="h-24 rounded-lg" />
                                        <Skeleton className="h-24 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {COLUMNS.map((column) => (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    candidates={getCandidatesByStatus(column.id)}
                                    onCandidateClick={handleCandidateClick}
                                    onDrop={handleDrop}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Candidate Detail Drawer */}
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                        {selectedCandidate && (
                            <>
                                <SheetHeader>
                                    <SheetTitle className="text-2xl">{selectedCandidate.name}</SheetTitle>
                                    <SheetDescription>{selectedCandidate.position}</SheetDescription>
                                </SheetHeader>

                                <Tabs defaultValue="profile" className="mt-6">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="profile">Profile</TabsTrigger>
                                        <TabsTrigger value="interview">Interview</TabsTrigger>
                                        <TabsTrigger value="offer">Offer</TabsTrigger>
                                    </TabsList>

                                    {/* Profile Tab */}
                                    <TabsContent value="profile" className="space-y-6 mt-6">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-pink-600" />
                                                Contact Information
                                            </h3>
                                            <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900">{selectedCandidate.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900">{selectedCandidate.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Application Info</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Applied Date</p>
                                                    <p className="font-medium text-gray-900">{selectedCandidate.appliedDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Current Stage</p>
                                                    <Badge className="mt-1">{selectedCandidate.status}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Interview Tab */}
                                    <TabsContent value="interview" className="space-y-4 mt-6">
                                        <Button
                                            onClick={() => setScheduleInterviewModalOpen(true)}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        >
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Schedule Interview
                                        </Button>

                                        <Button
                                            onClick={() => setInterviewResultModalOpen(true)}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Submit Interview Result
                                        </Button>

                                        {interviewsLoading ? (
                                            <div className="space-y-3">
                                                <Skeleton className="h-20 rounded-lg" />
                                                <Skeleton className="h-20 rounded-lg" />
                                            </div>
                                        ) : candidateInterviews.length > 0 ? (
                                            <div className="space-y-3">
                                                {candidateInterviews.map((interview) => (
                                                    <div key={interview.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Badge variant="outline" className="capitalize">{interview.type}</Badge>
                                                            <Badge className={
                                                                interview.result === "passed" ? "bg-green-100 text-green-700" :
                                                                interview.result === "failed" ? "bg-red-100 text-red-700" :
                                                                "bg-blue-100 text-blue-700"
                                                            }>
                                                                {interview.result || interview.status || "scheduled"}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(interview.scheduled_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                            {" "}
                                                            {new Date(interview.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Clock className="w-3 h-3" />
                                                            {interview.duration_minutes} minutes
                                                        </div>
                                                        {interview.location && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <MapPin className="w-3 h-3" />
                                                                {interview.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p>No interviews scheduled yet</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Offer Tab */}
                                    <TabsContent value="offer" className="space-y-4 mt-6">
                                        <Button
                                            onClick={() => setCreateOfferModalOpen(true)}
                                            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Create Offer
                                        </Button>

                                        {offersLoading ? (
                                            <div className="space-y-3">
                                                <Skeleton className="h-24 rounded-lg" />
                                            </div>
                                        ) : candidateOffers.length > 0 ? (
                                            <div className="space-y-3">
                                                {candidateOffers.map((offer) => (
                                                    <div key={offer.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <p className="font-semibold text-gray-900">{offer.position}</p>
                                                            <Badge className={
                                                                offer.status === "accepted" ? "bg-green-100 text-green-700" :
                                                                offer.status === "rejected" ? "bg-red-100 text-red-700" :
                                                                offer.status === "sent" ? "bg-blue-100 text-blue-700" :
                                                                offer.status === "withdrawn" ? "bg-gray-100 text-gray-700" :
                                                                "bg-amber-100 text-amber-700"
                                                            }>
                                                                {offer.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <DollarSign className="w-3 h-3" />
                                                            {formatCurrency(offer.base_salary)}
                                                        </div>
                                                        {offer.employment_type && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Briefcase className="w-3 h-3" />
                                                                <span className="capitalize">{offer.employment_type.replace("_", " ")}</span>
                                                            </div>
                                                        )}
                                                        {offer.start_date && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Calendar className="w-3 h-3" />
                                                                Start: {new Date(offer.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2 mt-2">
                                                            {offer.status === "draft" && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setSelectedOffer({
                                                                            id: offer.id,
                                                                            decision: "sent",
                                                                            candidateName: selectedCandidate?.name,
                                                                            position: offer.position,
                                                                        });
                                                                        setOfferDecisionModalOpen(true);
                                                                    }}
                                                                >
                                                                    <Send className="w-3 h-3 mr-1" />
                                                                    Send Offer
                                                                </Button>
                                                            )}
                                                            {offer.status === "sent" && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                        onClick={() => {
                                                                            setSelectedOffer({
                                                                                id: offer.id,
                                                                                decision: "accepted",
                                                                                candidateName: selectedCandidate?.name,
                                                                                position: offer.position,
                                                                            });
                                                                            setOfferDecisionModalOpen(true);
                                                                        }}
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                                        onClick={() => {
                                                                            setSelectedOffer({
                                                                                id: offer.id,
                                                                                decision: "rejected",
                                                                                candidateName: selectedCandidate?.name,
                                                                                position: offer.position,
                                                                            });
                                                                            setOfferDecisionModalOpen(true);
                                                                        }}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p>No offers created yet</p>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </>
                        )}
                    </SheetContent>
                </Sheet>

                {/* Confirmation Dialog */}
                <AlertDialog open={confirmDialog?.open || false} onOpenChange={(open) => !open && setConfirmDialog(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                            <AlertDialogDescription>
                                {confirmDialog && (
                                    <>
                                        Are you sure you want to move this candidate from{" "}
                                        <strong>{confirmDialog.fromStatus}</strong> to{" "}
                                        <strong>{confirmDialog.toStatus}</strong>?
                                    </>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmStatusChange}
                                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                            >
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Schedule Interview Modal */}
                <ScheduleInterviewModal
                    open={scheduleInterviewModalOpen}
                    onOpenChange={setScheduleInterviewModalOpen}
                    onScheduled={() => {
                        fetchCandidates();
                        if (selectedCandidate) handleCandidateClick(selectedCandidate);
                    }}
                    candidateApplicationId={selectedCandidate?.candidate_application_id}
                    manpowerRequestId={Number(params.id)}
                />

                {/* Interview Result Modal */}
                <InterviewResultModal
                    open={interviewResultModalOpen}
                    onOpenChange={setInterviewResultModalOpen}
                    onResultSubmitted={() => {
                        fetchCandidates();
                        if (selectedCandidate) handleCandidateClick(selectedCandidate);
                    }}
                    interview={selectedCandidate ? {
                        candidateName: selectedCandidate.name,
                        position: selectedCandidate.position,
                    } : null}
                />

                {/* Create Offer Modal */}
                <CreateOfferModal
                    open={createOfferModalOpen}
                    onOpenChange={setCreateOfferModalOpen}
                    onCreated={() => {
                        fetchCandidates();
                        if (selectedCandidate) handleCandidateClick(selectedCandidate);
                    }}
                    candidateApplicationId={selectedCandidate?.candidate_application_id}
                    position={selectedCandidate?.position}
                    candidateName={selectedCandidate?.name}
                />

                {/* Offer Decision Modal */}
                <OfferDecisionModal
                    open={offerDecisionModalOpen}
                    onOpenChange={setOfferDecisionModalOpen}
                    onDecisionMade={() => {
                        fetchCandidates();
                        if (selectedCandidate) handleCandidateClick(selectedCandidate);
                    }}
                    offer={selectedOffer}
                />

                {/* Add Candidate Dialog */}
                <Dialog open={addCandidateOpen} onOpenChange={setAddCandidateOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Candidate</DialogTitle>
                            <DialogDescription>
                                Select a candidate from the talent pool to add to this pipeline
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
            </div>
        </DndProvider>
    );
}
