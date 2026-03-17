"use client"
import { Plus, Search, Filter, Mail, Phone, Eye, Edit, Trash2, UserCheck, UserX, Building2 } from "lucide-react";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../_components/ui/table";
import { Badge } from "../../_components/ui/badge";
import { Button } from "../../_components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../_components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../_components/ui/select";
import { Input } from "../../_components/ui/input";
import {useRouter} from "next/navigation";

interface CandidatePoolProps {
    onAddCandidate: () => void;
}

interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    status: "AVAILABLE" | "EMPLOYED" | "BLACKLISTED" | "IN_PROCESS";
    appliedTo: string[];
    skills: string[];
    experience: string;
    location: string;
    lastUpdate: string;
}

// Mock data
const mockCandidates: Candidate[] = [
    {
        id: "C-001",
        name: "Ahmad Rizki",
        email: "ahmad.rizki@email.com",
        phone: "+62 812-3456-7890",
        source: "LinkedIn",
        status: "AVAILABLE",
        appliedTo: ["MPR-001: Software Engineer"],
        skills: ["React", "Node.js", "TypeScript"],
        experience: "3 years",
        location: "Jakarta Selatan",
        lastUpdate: "2026-03-04",
    },
    {
        id: "C-002",
        name: "Siti Nurhaliza",
        email: "siti.n@email.com",
        phone: "+62 813-4567-8901",
        source: "Job Portal",
        status: "AVAILABLE",
        appliedTo: ["MPR-001: Software Engineer", "MPR-003: Frontend Developer"],
        skills: ["React", "Vue.js", "Python"],
        experience: "5 years",
        location: "Jakarta Pusat",
        lastUpdate: "2026-03-03",
    },
    {
        id: "C-003",
        name: "Budi Santoso",
        email: "budi.santoso@email.com",
        phone: "+62 814-5678-9012",
        source: "Referral",
        status: "IN_PROCESS",
        appliedTo: ["MPR-001: Software Engineer"],
        skills: ["React", "Angular", "Java"],
        experience: "4 years",
        location: "Tangerang",
        lastUpdate: "2026-03-02",
    },
    {
        id: "C-004",
        name: "Dewi Lestari",
        email: "dewi.lestari@email.com",
        phone: "+62 815-6789-0123",
        source: "LinkedIn",
        status: "IN_PROCESS",
        appliedTo: ["MPR-001: Software Engineer"],
        skills: ["React", "Node.js", "PostgreSQL"],
        experience: "6 years",
        location: "Jakarta Selatan",
        lastUpdate: "2026-03-01",
    },
    {
        id: "C-005",
        name: "Eko Prasetyo",
        email: "eko.p@email.com",
        phone: "+62 816-7890-1234",
        source: "Job Portal",
        status: "EMPLOYED",
        appliedTo: ["MPR-001: Software Engineer"],
        skills: ["React", "Node.js", "MongoDB"],
        experience: "4 years",
        location: "Bekasi",
        lastUpdate: "2026-02-28",
    },
    {
        id: "C-006",
        name: "Fitri Handayani",
        email: "fitri.h@email.com",
        phone: "+62 817-8901-2345",
        source: "Referral",
        status: "EMPLOYED",
        appliedTo: ["MPR-001: Software Engineer"],
        skills: ["React", "Vue.js", "Node.js"],
        experience: "5 years",
        location: "Jakarta Barat",
        lastUpdate: "2026-02-26",
    },
    {
        id: "C-007",
        name: "Hadi Wibowo",
        email: "hadi.w@email.com",
        phone: "+62 818-9012-3456",
        source: "LinkedIn",
        status: "BLACKLISTED",
        appliedTo: ["MPR-002: Backend Developer"],
        skills: ["Java", "Spring Boot"],
        experience: "2 years",
        location: "Bogor",
        lastUpdate: "2026-02-20",
    },
    {
        id: "C-008",
        name: "Indah Permata",
        email: "indah.p@email.com",
        phone: "+62 819-0123-4567",
        source: "Job Portal",
        status: "AVAILABLE",
        appliedTo: [],
        skills: ["React", "TypeScript", "GraphQL"],
        experience: "3 years",
        location: "Jakarta Timur",
        lastUpdate: "2026-03-05",
    },
    {
        id: "C-009",
        name: "Joko Susilo",
        email: "joko.s@email.com",
        phone: "+62 820-1234-5678",
        source: "Referral",
        status: "AVAILABLE",
        appliedTo: ["MPR-004: DevOps Engineer"],
        skills: ["Docker", "Kubernetes", "AWS"],
        experience: "7 years",
        location: "Depok",
        lastUpdate: "2026-03-04",
    },
    {
        id: "C-010",
        name: "Kartika Sari",
        email: "kartika.s@email.com",
        phone: "+62 821-2345-6789",
        source: "LinkedIn",
        status: "AVAILABLE",
        appliedTo: [],
        skills: ["UI/UX Design", "Figma", "Adobe XD"],
        experience: "4 years",
        location: "Jakarta Selatan",
        lastUpdate: "2026-03-03",
    },
];

const CandidatePool = ()=> {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [sourceFilter, setSourceFilter] = useState<string>("ALL");

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return <UserCheck className="w-3 h-3" />;
            case "BLACKLISTED":
                return <UserX className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const filteredCandidates = mockCandidates.filter((candidate) => {
        const matchesSearch =
            candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.phone.includes(searchQuery) ||
            candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === "ALL" || candidate.status === statusFilter;
        const matchesSource = sourceFilter === "ALL" || candidate.source === sourceFilter;

        return matchesSearch && matchesStatus && matchesSource;
    });

    const sources = Array.from(new Set(mockCandidates.map(c => c.source)));

    const onViewDetail = (id: string) => {
        router.push('/org/candidates/' + id);
    }

    const onAddCandidate = () => {
        router.push('/org/candidates/create');
    }

    return (
        <div className="px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Talent Pool</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage and track all candidates in your talent pool
                    </p>
                </div>

                <button
                    onClick={onAddCandidate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Candidate
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-50 rounded-lg">
                            <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Available</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockCandidates.filter(c => c.status === "AVAILABLE").length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-lg">
                            <UserCheck className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">In Process</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockCandidates.filter(c => c.status === "IN_PROCESS").length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-lg">
                            <UserCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Employed</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {mockCandidates.filter(c => c.status === "EMPLOYED").length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pink-50 rounded-lg">
                            <UserCheck className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Pool</p>
                            <p className="text-2xl font-bold text-gray-900">{mockCandidates.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search by name, email, phone, or skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="IN_PROCESS">In Process</SelectItem>
                            <SelectItem value="EMPLOYED">Employed</SelectItem>
                            <SelectItem value="BLACKLISTED">Blacklisted</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Source Filter */}
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Sources</SelectItem>
                            {sources.map(source => (
                                <SelectItem key={source} value={source}>{source}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Active Filters Display */}
                {(statusFilter !== "ALL" || sourceFilter !== "ALL" || searchQuery) && (
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {searchQuery && (
                            <Badge variant="secondary" className="bg-pink-50 text-pink-700">
                                Search: &#34;{searchQuery}&#34;
                            </Badge>
                        )}
                        {statusFilter !== "ALL" && (
                            <Badge variant="secondary" className="bg-pink-50 text-pink-700">
                                Status: {statusFilter}
                            </Badge>
                        )}
                        {sourceFilter !== "ALL" && (
                            <Badge variant="secondary" className="bg-pink-50 text-pink-700">
                                Source: {sourceFilter}
                            </Badge>
                        )}
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setStatusFilter("ALL");
                                setSourceFilter("ALL");
                            }}
                            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Candidate</TableHead>
                            <TableHead className="font-semibold">Contact</TableHead>
                            <TableHead className="font-semibold">Source</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Skills</TableHead>
                            <TableHead className="font-semibold">Applied To</TableHead>
                            <TableHead className="font-semibold">Last Update</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCandidates.length > 0 ? (
                            filteredCandidates.map((candidate) => (
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
                                        <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                            {candidate.source}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(candidate.status)}`}>
                                            {getStatusIcon(candidate.status)}
                                            {candidate.status.replace("_", " ")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {candidate.skills.slice(0, 3).map((skill, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-xs bg-pink-50 text-pink-700">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {candidate.skills.length > 3 && (
                                                <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-700">
                                                    +{candidate.skills.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[200px]">
                                            {candidate.appliedTo.length > 0 ? (
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-900 flex items-center gap-1">
                                                        <Building2 className="w-3 h-3 text-gray-400" />
                                                        {candidate.appliedTo[0]}
                                                    </p>
                                                    {candidate.appliedTo.length > 1 && (
                                                        <p className="text-xs text-gray-500">
                                                            +{candidate.appliedTo.length - 1} more
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">-</p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900">
                                            {new Date(candidate.lastUpdate).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <span className="text-gray-600">⋮</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onViewDetail(candidate.id)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                                    No candidates found matching your filters
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 text-center">
                Showing {filteredCandidates.length} of {mockCandidates.length} candidates
            </div>
        </div>
    );
}

export default CandidatePool;
