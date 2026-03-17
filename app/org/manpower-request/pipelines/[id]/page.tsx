"use client"
import {
    ArrowLeft,
    Phone,
    Mail,
    Calendar,
    MapPin,
    Briefcase,
    GraduationCap,
    FileText,
    MessageSquare,
    Video,
    CheckCircle,
    Clock,
    AlertCircle,
    Plus,
    X,
    Send
} from "lucide-react";
import { useState } from "react";
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
import {useParams, useRouter} from "next/navigation";
import {InterviewScheduleData, ScheduleInterviewModal} from "@/app/_components/ScheduleInterviewModal";
import {CreateOfferModal, OfferData} from "@/app/_components/CreateOfferModal";
import {OfferDecisionModal} from "@/app/_components/OfferDecisionModal";

type CandidateStatus = "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFERED" | "HIRED";

interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: CandidateStatus;
    appliedDate: string;
    lastActivity: string;
    hasInterview: boolean;
    hasOffer: boolean;
    position: string;
    location: string;
    experience: string;
    education: string;
    expectedSalary: string;
    availability: string;
    skills: string[];
    interviews: Interview[];
    offers: Offer[];
    notes: Note[];
}

interface Interview {
    id: string;
    type: string;
    date: string;
    time: string;
    interviewer: string;
    status: string;
    feedback: string;
}

interface Offer {
    id: string;
    decision?: string;
    salary: string;
    benefits: string[];
    startDate: string;
    status: string;
    candidateName?: string;
    position?: string;
}

interface Note {
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
}

// Mock candidates data
const mockCandidates: Candidate[] = [
    {
        id: "C-001",
        name: "Ahmad Rizki",
        email: "ahmad.rizki@email.com",
        phone: "+62 812-3456-7890",
        status: "APPLIED",
        appliedDate: "2026-03-01",
        lastActivity: "2 hours ago",
        hasInterview: false,
        hasOffer: false,
        position: "Software Engineer",
        location: "Jakarta Selatan",
        experience: "3 years",
        education: "S1 Informatika - UI",
        expectedSalary: "Rp 10.000.000",
        availability: "2 weeks notice",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        interviews: [],
        offers: [],
        notes: [
            {
                id: "N-001",
                content: "Strong technical background, good communication skills",
                createdBy: "Sarah Connor",
                createdAt: "2026-03-01 10:30",
            },
        ],
    },
    {
        id: "C-002",
        name: "Siti Nurhaliza",
        email: "siti.n@email.com",
        phone: "+62 813-4567-8901",
        status: "APPLIED",
        appliedDate: "2026-03-02",
        lastActivity: "5 hours ago",
        hasInterview: false,
        hasOffer: false,
        position: "Software Engineer",
        location: "Jakarta Pusat",
        experience: "5 years",
        education: "S1 Teknik Komputer - ITB",
        expectedSalary: "Rp 12.000.000",
        availability: "Immediate",
        skills: ["React", "Vue.js", "Python", "Docker"],
        interviews: [],
        offers: [],
        notes: [],
    },
    {
        id: "C-003",
        name: "Budi Santoso",
        email: "budi.santoso@email.com",
        phone: "+62 814-5678-9012",
        status: "SCREENING",
        appliedDate: "2026-02-28",
        lastActivity: "1 day ago",
        hasInterview: true,
        hasOffer: false,
        position: "Software Engineer",
        location: "Tangerang",
        experience: "4 years",
        education: "S1 Sistem Informasi - Binus",
        expectedSalary: "Rp 11.000.000",
        availability: "1 month notice",
        skills: ["React", "Angular", "Java", "Spring Boot"],
        interviews: [
            {
                id: "I-001",
                type: "Phone Screening",
                date: "2026-03-05",
                time: "10:00 AM",
                interviewer: "Sarah Connor",
                status: "Scheduled",
                feedback: "",
            },
        ],
        offers: [],
        notes: [
            {
                id: "N-002",
                content: "Experienced with enterprise applications",
                createdBy: "Sarah Connor",
                createdAt: "2026-02-28 14:20",
            },
        ],
    },
    {
        id: "C-004",
        name: "Dewi Lestari",
        email: "dewi.lestari@email.com",
        phone: "+62 815-6789-0123",
        status: "INTERVIEW",
        appliedDate: "2026-02-25",
        lastActivity: "3 hours ago",
        hasInterview: true,
        hasOffer: false,
        position: "Software Engineer",
        location: "Jakarta Selatan",
        experience: "6 years",
        education: "S1 Teknik Informatika - UGM",
        expectedSalary: "Rp 13.000.000",
        availability: "2 weeks notice",
        skills: ["React", "Node.js", "PostgreSQL", "Redis", "Kubernetes"],
        interviews: [
            {
                id: "I-002",
                type: "Phone Screening",
                date: "2026-02-27",
                time: "2:00 PM",
                interviewer: "Sarah Connor",
                status: "Completed",
                feedback: "Excellent communication, good technical knowledge",
            },
            {
                id: "I-003",
                type: "Technical Interview",
                date: "2026-03-05",
                time: "2:00 PM",
                interviewer: "John Tech Lead",
                status: "Scheduled",
                feedback: "",
            },
        ],
        offers: [],
        notes: [
            {
                id: "N-003",
                content: "Top candidate, senior level experience",
                createdBy: "Sarah Connor",
                createdAt: "2026-02-27 16:45",
            },
        ],
    },
    {
        id: "C-005",
        name: "Eko Prasetyo",
        email: "eko.p@email.com",
        phone: "+62 816-7890-1234",
        status: "OFFERED",
        appliedDate: "2026-02-20",
        lastActivity: "2 days ago",
        hasInterview: true,
        hasOffer: true,
        position: "Software Engineer",
        location: "Bekasi",
        experience: "4 years",
        education: "S1 Informatika - ITS",
        expectedSalary: "Rp 11.500.000",
        availability: "1 month notice",
        skills: ["React", "Node.js", "MongoDB", "GraphQL"],
        interviews: [
            {
                id: "I-004",
                type: "Phone Screening",
                date: "2026-02-22",
                time: "10:00 AM",
                interviewer: "Sarah Connor",
                status: "Completed",
                feedback: "Good fit for the role",
            },
            {
                id: "I-005",
                type: "Technical Interview",
                date: "2026-02-26",
                time: "3:00 PM",
                interviewer: "John Tech Lead",
                status: "Completed",
                feedback: "Strong technical skills, passed coding test",
            },
            {
                id: "I-006",
                type: "Final Interview",
                date: "2026-03-01",
                time: "11:00 AM",
                interviewer: "Jane HR Manager",
                status: "Completed",
                feedback: "Recommended for hire",
            },
        ],
        offers: [
            {
                id: "O-001",
                salary: "Rp 12.000.000",
                benefits: ["Health Insurance", "Annual Leave 12 days", "Performance Bonus"],
                startDate: "2026-04-01",
                status: "Pending",
            },
        ],
        notes: [
            {
                id: "N-004",
                content: "Offer sent, waiting for response",
                createdBy: "Sarah Connor",
                createdAt: "2026-03-03 09:15",
            },
        ],
    },
    {
        id: "C-006",
        name: "Fitri Handayani",
        email: "fitri.h@email.com",
        phone: "+62 817-8901-2345",
        status: "HIRED",
        appliedDate: "2026-02-15",
        lastActivity: "1 week ago",
        hasInterview: true,
        hasOffer: true,
        position: "Software Engineer",
        location: "Jakarta Barat",
        experience: "5 years",
        education: "S1 Informatika - Telkom University",
        expectedSalary: "Rp 12.500.000",
        availability: "Immediate",
        skills: ["React", "Vue.js", "Node.js", "AWS", "CI/CD"],
        interviews: [
            {
                id: "I-007",
                type: "Phone Screening",
                date: "2026-02-17",
                time: "1:00 PM",
                interviewer: "Sarah Connor",
                status: "Completed",
                feedback: "Excellent candidate",
            },
            {
                id: "I-008",
                type: "Technical Interview",
                date: "2026-02-21",
                time: "10:00 AM",
                interviewer: "John Tech Lead",
                status: "Completed",
                feedback: "Outstanding performance in coding test",
            },
            {
                id: "I-009",
                type: "Final Interview",
                date: "2026-02-24",
                time: "2:00 PM",
                interviewer: "Jane HR Manager",
                status: "Completed",
                feedback: "Perfect fit for the team",
            },
        ],
        offers: [
            {
                id: "O-002",
                salary: "Rp 13.000.000",
                benefits: ["Health Insurance", "Annual Leave 15 days", "Performance Bonus", "Stock Options"],
                startDate: "2026-03-15",
                status: "Accepted",
            },
        ],
        notes: [
            {
                id: "N-005",
                content: "Offer accepted, starting March 15",
                createdBy: "Sarah Connor",
                createdAt: "2026-02-26 11:30",
            },
            {
                id: "N-006",
                content: "Onboarding materials sent",
                createdBy: "HR Team",
                createdAt: "2026-03-01 09:00",
            },
        ],
    },
];

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
                    <p className="text-xs text-gray-500">Last: {candidate.lastActivity}</p>
                </div>

                <div className="flex items-center gap-2">
                    {candidate.hasInterview && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            <Video className="w-3 h-3 mr-1" />
                            Interview
                        </Badge>
                    )}
                    {candidate.hasOffer && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            <FileText className="w-3 h-3 mr-1" />
                            Offer
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}

interface KanbanColumnProps {
    column: { id: CandidateStatus; title: string; color: string };
    candidates: Candidate[];
    onCandidateClick: (candidate: Candidate) => void;
    onDrop: (candidateId: string, fromStatus: CandidateStatus, toStatus: CandidateStatus) => void;
}

function KanbanColumn({ column, candidates, onCandidateClick, onDrop }: KanbanColumnProps) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ITEM_TYPE,
        drop: (item: { id: string; currentStatus: CandidateStatus }) => {
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

function InterviewResultModal(props: {
    open: boolean,
    onOpenChange: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    onResult: (result: ("PASS" | "FAIL"), notes: string) => void,
    interview: Interview | null
}) {
    return null;
}

export default function CandidatePipeline() {
    const params = useParams<{ id: string }>()

    const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        candidateId: string;
        fromStatus: CandidateStatus;
        toStatus: CandidateStatus;
    } | null>(null);
    const [newNote, setNewNote] = useState("");
    const [scheduleInterviewModalOpen, setScheduleInterviewModalOpen] = useState(false);
    const [interviewResultModalOpen, setInterviewResultModalOpen] = useState(false);
    const [createOfferModalOpen, setCreateOfferModalOpen] = useState(false);
    const [offerDecisionModalOpen, setOfferDecisionModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    const router = useRouter();

    const handleCandidateClick = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setIsDrawerOpen(true);
    };

    const handleDrop = (candidateId: string, fromStatus: CandidateStatus, toStatus: CandidateStatus) => {
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

        // Update selected candidate if it's the one being moved
        if (selectedCandidate && selectedCandidate.id === confirmDialog.candidateId) {
            setSelectedCandidate({ ...selectedCandidate, status: confirmDialog.toStatus });
        }

        setConfirmDialog(null);
    };

    const handleAddNote = () => {
        if (!newNote.trim() || !selectedCandidate) return;

        const note: Note = {
            id: `N-${Date.now()}`,
            content: newNote,
            createdBy: "Sarah Connor",
            createdAt: new Date().toLocaleString('id-ID'),
        };

        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === selectedCandidate.id
                    ? { ...candidate, notes: [...candidate.notes, note] }
                    : candidate
            )
        );

        setSelectedCandidate({
            ...selectedCandidate,
            notes: [...selectedCandidate.notes, note],
        });

        setNewNote("");
    };

    const getCandidatesByStatus = (status: CandidateStatus) => {
        return candidates.filter((c) => c.status === status);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            Scheduled: "bg-blue-50 text-blue-700",
            Completed: "bg-green-50 text-green-700",
            Pending: "bg-amber-50 text-amber-700",
            Accepted: "bg-green-50 text-green-700",
        };
        return colors[status] || "bg-gray-50 text-gray-700";
    };

    const handleScheduleInterview = (interviewData: InterviewScheduleData) => {
        if (!selectedCandidate) return;

        const newInterview: Interview = {
            id: `I-${Date.now()}`,
            type: "Technical Interview",
            date: interviewData.date,
            time: interviewData.time,
            interviewer: interviewData.interviewer,
            status: "Scheduled",
            feedback: interviewData.notes || "",
        };

        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === selectedCandidate.id
                    ? { ...candidate, interviews: [...candidate.interviews, newInterview], hasInterview: true }
                    : candidate
            )
        );

        setSelectedCandidate({
            ...selectedCandidate,
            interviews: [...selectedCandidate.interviews, newInterview],
            hasInterview: true,
        });

        setScheduleInterviewModalOpen(false);
    };

    const handleInterviewResult = (result: "PASS" | "FAIL", notes: string) => {
        if (!selectedCandidate) return;

        // If PASS, move to OFFERED stage
        // If FAIL, reject candidate
        const newStatus: CandidateStatus = result === "PASS" ? "OFFERED" : "SCREENING";

        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === selectedCandidate.id
                    ? { ...candidate, status: newStatus }
                    : candidate
            )
        );

        setSelectedCandidate({
            ...selectedCandidate,
            status: newStatus,
        });

        setInterviewResultModalOpen(false);

        // If passed, auto-open create offer modal
        if (result === "PASS") {
            setTimeout(() => setCreateOfferModalOpen(true), 500);
        }
    };

    const handleCreateOffer = (offerData: OfferData) => {
        if (!selectedCandidate) return;

        const benefitsArray = offerData.benefits ? offerData.benefits.split(',').map(b => b.trim()) : [];

        const newOffer: Offer = {
            id: `O-${Date.now()}`,
            salary: offerData.salary,
            benefits: benefitsArray,
            startDate: offerData.startDate,
            status: "Pending",
        };

        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === selectedCandidate.id
                    ? { ...candidate, offers: [...candidate.offers, newOffer], hasOffer: true, status: "OFFERED" }
                    : candidate
            )
        );

        setSelectedCandidate({
            ...selectedCandidate,
            offers: [...selectedCandidate.offers, newOffer],
            hasOffer: true,
            status: "OFFERED",
        });

        setCreateOfferModalOpen(false);
    };

    const handleOfferAccept = () => {
        if (!selectedCandidate) return;

        // Move candidate to HIRED status
        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === selectedCandidate.id
                    ? { ...candidate, status: "HIRED" }
                    : candidate
            )
        );

        setOfferDecisionModalOpen(false);
        setIsDrawerOpen(false);

        // Trigger hire flow
        if (onHire) {
            onHire(selectedCandidate.id, selectedCandidate.name);
        }
    };

    const onHire = (candidateId: string, candidateName: string) => {

    }

    const handleOfferDecline = () => {
        if (!selectedCandidate) return;

        // Move candidate back to INTERVIEW status
        setCandidates((prev) =>
            prev.map((candidate) =>
                candidate.id === selectedCandidate.id
                    ? { ...candidate, status: "INTERVIEW" }
                    : candidate
            )
        );

        setOfferDecisionModalOpen(false);
    };

    const onBack = () => {
        router.back();
    }

    const onAddCandidate = () => {
        router.push(`/org/candidates/create`);
    }
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
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="profile">Profile</TabsTrigger>
                                        <TabsTrigger value="interview">Interview</TabsTrigger>
                                        <TabsTrigger value="offer">Offer</TabsTrigger>
                                        <TabsTrigger value="notes">Notes</TabsTrigger>
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
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900">{selectedCandidate.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-pink-600" />
                                                Professional Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Experience</p>
                                                    <p className="font-medium text-gray-900">{selectedCandidate.experience}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Education</p>
                                                    <p className="font-medium text-gray-900">{selectedCandidate.education}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Expected Salary</p>
                                                    <p className="font-medium text-gray-900">{selectedCandidate.expectedSalary}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Availability</p>
                                                    <p className="font-medium text-gray-900">{selectedCandidate.availability}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCandidate.skills.map((skill) => (
                                                    <Badge key={skill} variant="secondary" className="bg-pink-50 text-pink-700">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Interview Tab */}
                                    <TabsContent value="interview" className="space-y-4 mt-6">
                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => setScheduleInterviewModalOpen(true)}
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                            >
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Schedule Interview
                                            </Button>
                                            {selectedCandidate.interviews.length > 0 && (
                                                <Button
                                                    onClick={() => setInterviewResultModalOpen(true)}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Submit Result
                                                </Button>
                                            )}
                                        </div>

                                        <Separator />

                                        {selectedCandidate.interviews.length > 0 ? (
                                            selectedCandidate.interviews.map((interview) => (
                                                <div key={interview.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{interview.type}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">Interviewer: {interview.interviewer}</p>
                                                        </div>
                                                        <Badge className={getStatusColor(interview.status)}>
                                                            {interview.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                      <Calendar className="w-4 h-4" />
                                                        {interview.date}
                                                    </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {interview.time}
                                                        </span>
                                                    </div>
                                                    {interview.feedback && (
                                                        <div className="pt-2 border-t border-gray-200">
                                                            <p className="text-sm text-gray-600 font-medium mb-1">Feedback:</p>
                                                            <p className="text-sm text-gray-700">{interview.feedback}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p>No interviews scheduled yet</p>
                                                <p className="text-sm mt-1">Click &#34;Schedule Interview&#34; to get started</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Offer Tab */}
                                    <TabsContent value="offer" className="space-y-4 mt-6">
                                        {/* Action Button */}
                                        {selectedCandidate.status === "OFFERED" || selectedCandidate.status === "INTERVIEW" ? (
                                            <Button
                                                onClick={() => setCreateOfferModalOpen(true)}
                                                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                Create Offer
                                            </Button>
                                        ) : null}

                                        {selectedCandidate.offers.length > 0 && (
                                            <Separator />
                                        )}

                                        {selectedCandidate.offers.length > 0 ? (
                                            selectedCandidate.offers.map((offer) => (
                                                <div key={offer.id} className="space-y-4">
                                                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                                        <div className="flex items-start justify-between">
                                                            <h4 className="font-semibold text-gray-900">Job Offer</h4>
                                                            <Badge className={getStatusColor(offer.status)}>
                                                                {offer.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <p className="text-sm text-gray-600">Salary</p>
                                                                <p className="font-semibold text-gray-900 text-lg">{offer.salary}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-600">Start Date</p>
                                                                <p className="font-medium text-gray-900">{offer.startDate}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-600 mb-2">Benefits</p>
                                                                <div className="space-y-1">
                                                                    {offer.benefits.map((benefit, idx) => (
                                                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                                            {benefit}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Simulate Offer Decision (for demo purposes) */}
                                                    {offer.status === "Pending" && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => {
                                                                    setSelectedOffer({ ...offer, decision: "ACCEPT", candidateName: selectedCandidate.name, position: selectedCandidate.position });
                                                                    setOfferDecisionModalOpen(true);
                                                                }}
                                                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Simulate Accept
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setSelectedOffer({ ...offer, decision: "DECLINE", candidateName: selectedCandidate.name, position: selectedCandidate.position });
                                                                    setOfferDecisionModalOpen(true);
                                                                }}
                                                                variant="outline"
                                                                className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                                                            >
                                                                <X className="w-4 h-4 mr-2" />
                                                                Simulate Decline
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p>No offer made yet</p>
                                                <p className="text-sm mt-1">Create an offer when candidate passes interview</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Notes Tab */}
                                    <TabsContent value="notes" className="space-y-4 mt-6">
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <Textarea
                                                    placeholder="Add a note..."
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    className="flex-1"
                                                    rows={3}
                                                />
                                            </div>
                                            <Button
                                                onClick={handleAddNote}
                                                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Note
                                            </Button>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3">
                                            {selectedCandidate.notes.length > 0 ? (
                                                selectedCandidate.notes.map((note) => (
                                                    <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                                                        <p className="text-sm text-gray-700 mb-2">{note.content}</p>
                                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                                            <span>{note.createdBy}</span>
                                                            <span>{note.createdAt}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                    <p>No notes yet</p>
                                                </div>
                                            )}
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
                    onSchedule={handleScheduleInterview}
                />

                {/* Interview Result Modal */}
                <InterviewResultModal
                    open={interviewResultModalOpen}
                    onOpenChange={setInterviewResultModalOpen}
                    onResult={handleInterviewResult}
                    interview={selectedInterview}
                />

                {/* Create Offer Modal */}
                <CreateOfferModal
                    open={createOfferModalOpen}
                    onOpenChange={setCreateOfferModalOpen}
                    onCreate={handleCreateOffer}
                />

                {/* Offer Decision Modal */}
                <OfferDecisionModal
                    open={offerDecisionModalOpen}
                    onOpenChange={setOfferDecisionModalOpen}
                    onAccept={handleOfferAccept}
                    onDecline={handleOfferDecline}
                    offer={selectedOffer}
                />

            </div>
        </DndProvider>
    );
}
