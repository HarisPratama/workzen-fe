"use client"
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
    Send
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
import { Badge } from "@/app/_components/ui/badge";
import { Separator } from "@/app/_components/ui/separator";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { ScheduleInterviewModal } from "@/app/_components/ScheduleInterviewModal";
import { CreateOfferModal } from "@/app/_components/CreateOfferModal";
import { OfferDecisionModal } from "@/app/_components/OfferDecisionModal";
import { InterviewResultModal } from "@/app/_components/InterviewResultModal";
import { getCandidatesForManpowerRequest } from "@/services/candidate-application.service";

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

    const handleCandidateClick = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setIsDrawerOpen(true);
    };

    const handleDrop = (candidateId: number, fromStatus: CandidateStatus, toStatus: CandidateStatus) => {
        setConfirmDialog({
            open: true,
            candidateId,
            fromStatus,
            toStatus,
        });
    };

    const confirmStatusChange = () => {
        if (!confirmDialog) return;

        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === confirmDialog.candidateId
                    ? { ...candidate, status: confirmDialog.toStatus }
                    : candidate
            )
        );

        if (selectedCandidate && selectedCandidate.id === confirmDialog.candidateId) {
            setSelectedCandidate({ ...selectedCandidate, status: confirmDialog.toStatus });
        }

        setConfirmDialog(null);
    };

    const getCandidatesByStatus = (status: CandidateStatus) => {
        return candidates.filter((c) => c.status === status);
    };

    const onBack = () => {
        router.back();
    };

    const onAddCandidate = () => {
        router.push(`/org/candidates/create`);
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

                    <button onClick={onAddCandidate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm">
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

                                        <div className="text-center py-8 text-gray-500">
                                            <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>Interview data loaded from API</p>
                                        </div>
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

                                        <div className="text-center py-8 text-gray-500">
                                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>Offer data loaded from API</p>
                                        </div>
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
                    onScheduled={fetchCandidates}
                    candidateApplicationId={selectedCandidate?.candidate_application_id}
                    manpowerRequestId={Number(params.id)}
                />

                {/* Interview Result Modal */}
                <InterviewResultModal
                    open={interviewResultModalOpen}
                    onOpenChange={setInterviewResultModalOpen}
                    onResultSubmitted={fetchCandidates}
                    interview={selectedCandidate ? {
                        candidateName: selectedCandidate.name,
                        position: selectedCandidate.position,
                    } : null}
                />

                {/* Create Offer Modal */}
                <CreateOfferModal
                    open={createOfferModalOpen}
                    onOpenChange={setCreateOfferModalOpen}
                    onCreated={fetchCandidates}
                    candidateApplicationId={selectedCandidate?.candidate_application_id}
                    position={selectedCandidate?.position}
                    candidateName={selectedCandidate?.name}
                />

                {/* Offer Decision Modal */}
                <OfferDecisionModal
                    open={offerDecisionModalOpen}
                    onOpenChange={setOfferDecisionModalOpen}
                    onDecisionMade={fetchCandidates}
                    offer={selectedOffer}
                />
            </div>
        </DndProvider>
    );
}
