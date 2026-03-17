"use client"
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Briefcase, GraduationCap, DollarSign, Clock, FileText, MessageSquare, Upload, Send, Building2, CheckCircle, X } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { Badge } from "@/app/_components/ui/badge";
import { Separator } from "@/app/_components/ui/separator";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/_components/ui/table";
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
import {useRouter} from "next/navigation";

interface CandidateDetailProps {
    candidateId: string;
    onBack: () => void;
}

interface Application {
    id: string;
    requestId: string;
    position: string;
    client: string;
    status: string;
    appliedDate: string;
    currentStage: string;
}

interface Document {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedDate: string;
    uploadedBy: string;
}

interface Note {
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
}

// Mock candidate detail
const mockCandidateDetail = {
    id: "C-001",
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    phone: "+62 812-3456-7890",
    status: "AVAILABLE",
    location: "Jakarta Selatan",
    experience: "3 years",
    education: "S1 Informatika - Universitas Indonesia",
    expectedSalary: "Rp 10.000.000",
    availability: "2 weeks notice",
    source: "LinkedIn",
    skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Docker"],
    summary: "Experienced Full Stack Developer with 3 years of professional experience in building scalable web applications. Strong expertise in React, Node.js, and cloud technologies. Proven track record of delivering high-quality solutions for enterprise clients.",
    joinedDate: "2026-02-15",
};

// Mock applications
const mockApplications: Application[] = [
    {
        id: "APP-001",
        requestId: "MPR-001",
        position: "Software Engineer",
        client: "PT Maju Jaya",
        status: "SCREENING",
        appliedDate: "2026-03-01",
        currentStage: "Phone Screening Scheduled",
    },
    {
        id: "APP-002",
        requestId: "MPR-003",
        position: "Frontend Developer",
        client: "PT Global Tech",
        status: "REJECTED",
        appliedDate: "2026-02-25",
        currentStage: "Not a good fit",
    },
    {
        id: "APP-003",
        requestId: "MPR-005",
        position: "Full Stack Developer",
        client: "CV Sukses Mandiri",
        status: "APPLIED",
        appliedDate: "2026-02-20",
        currentStage: "Application Submitted",
    },
];

// Mock documents
const mockDocuments: Document[] = [
    {
        id: "DOC-001",
        name: "Resume - Ahmad Rizki.pdf",
        type: "Resume",
        size: "245 KB",
        uploadedDate: "2026-02-15",
        uploadedBy: "Ahmad Rizki",
    },
    {
        id: "DOC-002",
        name: "KTP.pdf",
        type: "ID Card",
        size: "180 KB",
        uploadedDate: "2026-02-15",
        uploadedBy: "Ahmad Rizki",
    },
    {
        id: "DOC-003",
        name: "Ijazah S1.pdf",
        type: "Degree Certificate",
        size: "320 KB",
        uploadedDate: "2026-02-15",
        uploadedBy: "Ahmad Rizki",
    },
    {
        id: "DOC-004",
        name: "Portfolio.pdf",
        type: "Portfolio",
        size: "1.2 MB",
        uploadedDate: "2026-02-16",
        uploadedBy: "Ahmad Rizki",
    },
    {
        id: "DOC-005",
        name: "Reference Letter - Previous Company.pdf",
        type: "Reference",
        size: "156 KB",
        uploadedDate: "2026-02-18",
        uploadedBy: "Sarah Connor",
    },
];

// Mock notes
const mockNotes: Note[] = [
    {
        id: "N-001",
        content: "Strong technical background, good communication skills. Recommended for Software Engineer positions.",
        createdBy: "Sarah Connor",
        createdAt: "2026-03-01 10:30",
    },
    {
        id: "N-002",
        content: "Candidate showed excellent problem-solving skills during initial screening call.",
        createdBy: "John Tech Lead",
        createdAt: "2026-03-02 14:15",
    },
    {
        id: "N-003",
        content: "Available to start within 2 weeks. Salary expectation is within range.",
        createdBy: "Sarah Connor",
        createdAt: "2026-03-03 09:45",
    },
];

// Mock available manpower requests
const mockManpowerRequests = [
    { id: "MPR-001", position: "Software Engineer", client: "PT Maju Jaya" },
    { id: "MPR-002", position: "Backend Developer", client: "CV Karya Bersama" },
    { id: "MPR-004", position: "DevOps Engineer", client: "PT Sejahtera Abadi" },
    { id: "MPR-006", position: "Full Stack Developer", client: "PT Digital Solutions" },
];

export default function CandidateDetail() {
    const router = useRouter();
    const [newNote, setNewNote] = useState("");
    const [notes, setNotes] = useState<Note[]>(mockNotes);
    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState("");

    const getStatusColor = (status: string) => {
        switch (status) {
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

    const getApplicationStatusColor = (status: string) => {
        switch (status) {
            case "APPLIED":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "SCREENING":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "INTERVIEW":
                return "bg-purple-50 text-purple-700 border-purple-200";
            case "OFFERED":
                return "bg-green-50 text-green-700 border-green-200";
            case "HIRED":
                return "bg-green-50 text-green-700 border-green-200";
            case "REJECTED":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const note: Note = {
            id: `N-${Date.now()}`,
            content: newNote,
            createdBy: "Sarah Connor",
            createdAt: new Date().toLocaleString('id-ID'),
        };

        setNotes([note, ...notes]);
        setNewNote("");
    };

    const handleApplyToRequest = () => {
        if (!selectedRequest) return;
        const candidateId = 1;
        console.log(`Applying candidate ${candidateId} to request ${selectedRequest}`);
        // In real app, make API call here
        setIsApplyDialogOpen(false);
        setSelectedRequest("");
    };

    const onBack = () => {
        router.back();
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
                            <h2 className="text-3xl font-bold text-gray-900">{mockCandidateDetail.name}</h2>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(mockCandidateDetail.status)}`}>
                                {mockCandidateDetail.status}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                  {mockCandidateDetail.phone}
              </span>
                            <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                                {mockCandidateDetail.email}
              </span>
                            <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                                {mockCandidateDetail.location}
              </span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => setIsApplyDialogOpen(true)}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                >
                    <Send className="w-4 h-4 mr-2" />
                    Apply to Request
                </Button>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pink-50 rounded-lg">
                            <Briefcase className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Experience</p>
                            <p className="font-semibold text-gray-900">{mockCandidateDetail.experience}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Education</p>
                            <p className="font-semibold text-gray-900 text-sm">S1 Informatika</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Expected Salary</p>
                            <p className="font-semibold text-gray-900 text-sm">Rp 10M</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Availability</p>
                            <p className="font-semibold text-gray-900 text-sm">{mockCandidateDetail.availability}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-white border border-gray-200 p-1">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="applications" className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
                        Applications ({mockApplications.length})
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
                        Documents ({mockDocuments.length})
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
                        Notes ({notes.length})
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-8">
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Professional Summary</h3>
                                <p className="text-gray-700 leading-relaxed">{mockCandidateDetail.summary}</p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-pink-600" />
                                    Professional Information
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Years of Experience</p>
                                        <p className="font-medium text-gray-900">{mockCandidateDetail.experience}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Education</p>
                                        <p className="font-medium text-gray-900">{mockCandidateDetail.education}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Expected Salary</p>
                                        <p className="font-medium text-gray-900">{mockCandidateDetail.expectedSalary}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Availability</p>
                                        <p className="font-medium text-gray-900">{mockCandidateDetail.availability}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Source</p>
                                        <p className="font-medium text-gray-900">{mockCandidateDetail.source}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Joined Pool</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(mockCandidateDetail.joinedDate).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {mockCandidateDetail.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="bg-pink-50 text-pink-700 px-3 py-1">
                                            {skill}
                                        </Badge>
                                    ))}
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
                                        <span className="text-gray-900">{mockCandidateDetail.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-900">{mockCandidateDetail.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-900">{mockCandidateDetail.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Applications Tab */}
                <TabsContent value="applications">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">Request ID</TableHead>
                                    <TableHead className="font-semibold">Position</TableHead>
                                    <TableHead className="font-semibold">Client</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Current Stage</TableHead>
                                    <TableHead className="font-semibold">Applied Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockApplications.map((application) => (
                                    <TableRow key={application.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <p className="font-medium text-gray-900">{application.requestId}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-gray-900">{application.position}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-gray-900 flex items-center gap-1">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                {application.client}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                                                {application.status}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-gray-900">{application.currentStage}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-gray-900">
                                                {new Date(application.appliedDate).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-900">Uploaded Documents</h3>
                            <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Document
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {mockDocuments.map((document) => (
                                <div key={document.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-pink-100 rounded-lg">
                                            <FileText className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{document.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {document.type} • {document.size} • Uploaded by {document.uploadedBy}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-500">
                                            {new Date(document.uploadedDate).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <Button variant="ghost" size="sm">
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Add New Note</h3>
                        <div className="space-y-3">
                            <Textarea
                                placeholder="Write your note here..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={4}
                            />
                            <Button
                                onClick={handleAddNote}
                                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Add Note
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">All Notes</h3>
                        <div className="space-y-4">
                            {notes.map((note) => (
                                <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 mb-3">{note.content}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="font-medium">{note.createdBy}</span>
                                        <span>{note.createdAt}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

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
                            <p className="font-semibold text-gray-900">{mockCandidateDetail.name}</p>
                            <p className="text-sm text-gray-600">{mockCandidateDetail.email}</p>
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
                                    {mockManpowerRequests.map((request) => (
                                        <SelectItem key={request.id} value={request.id}>
                                            {request.id} - {request.position} ({request.client})
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
                            disabled={!selectedRequest}
                            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Apply Candidate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
