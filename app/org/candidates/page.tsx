"use client"
import { Plus, Search, Mail, Phone, Eye, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
import { Skeleton } from "../../_components/ui/skeleton";
import { useRouter } from "next/navigation";
import { getCandidates, deleteCandidate } from "@/services/candidate.service";

interface Candidate {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    birth_date: string;
    address: string;
    citizen_id?: string;
    created_at: string;
    updated_at: string;
}

const CandidatePool = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCandidates({
                page,
                limit: 10,
                search: searchQuery,
            });
            setCandidates(res.data ?? []);
            setTotalPages(res.pagination?.total_pages ?? 1);
            setTotal(res.pagination?.total ?? 0);
        } catch (error) {
            console.error("Failed to fetch candidates:", error);
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCandidates();
        }, searchQuery ? 400 : 0);
        return () => clearTimeout(timeout);
    }, [fetchCandidates, searchQuery]);

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

    const getStatusIcon = (status: string) => {
        switch (status?.toUpperCase()) {
            case "AVAILABLE":
                return <UserCheck className="w-3 h-3" />;
            case "BLACKLISTED":
                return <UserX className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const filteredCandidates = statusFilter === "ALL"
        ? candidates
        : candidates.filter((c) => c.status?.toUpperCase() === statusFilter);

    const onViewDetail = (id: number) => {
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
                                {loading ? <Skeleton className="w-8 h-7" /> : candidates.filter(c => c.status?.toUpperCase() === "AVAILABLE").length}
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
                                {loading ? <Skeleton className="w-8 h-7" /> : candidates.filter(c => c.status?.toUpperCase() === "IN_PROCESS").length}
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
                                {loading ? <Skeleton className="w-8 h-7" /> : candidates.filter(c => c.status?.toUpperCase() === "EMPLOYED").length}
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
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? <Skeleton className="w-8 h-7" /> : total}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>
                    </div>

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
                </div>

                {(statusFilter !== "ALL" || searchQuery) && (
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {searchQuery && (
                            <Badge variant="secondary" className="bg-pink-50 text-pink-700">
                                Search: &quot;{searchQuery}&quot;
                            </Badge>
                        )}
                        {statusFilter !== "ALL" && (
                            <Badge variant="secondary" className="bg-pink-50 text-pink-700">
                                Status: {statusFilter}
                            </Badge>
                        )}
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setStatusFilter("ALL");
                                setPage(1);
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
                            <TableHead className="font-semibold">Address</TableHead>
                            <TableHead className="font-semibold">Joined</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({length: 5}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="w-32 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-40 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-20 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-24 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-32 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-24 h-5" /></TableCell>
                                    <TableCell><Skeleton className="w-8 h-5 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredCandidates.length > 0 ? (
                            filteredCandidates.map((candidate) => (
                                <TableRow key={candidate.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{candidate.full_name}</p>
                                            <p className="text-sm text-gray-600">ID: {candidate.id}</p>
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
                                            {candidate.source || "-"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(candidate.status)}`}>
                                            {getStatusIcon(candidate.status)}
                                            {(candidate.status || "").replace("_", " ")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900 max-w-[200px] truncate">
                                            {candidate.address || "-"}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-900">
                                            {candidate.created_at
                                                ? new Date(candidate.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                                : "-"}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <span className="text-gray-600">&#8942;</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onViewDetail(candidate.id)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onViewDetail(candidate.id)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={async () => {
                                                    if (!confirm(`Delete candidate "${candidate.full_name}"?`)) return;
                                                    try {
                                                        await deleteCandidate(String(candidate.id));
                                                        fetchCandidates();
                                                    } catch {
                                                        alert("Failed to delete candidate.");
                                                    }
                                                }}>
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
                                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                    No candidates found matching your filters
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing {filteredCandidates.length} of {total} candidates
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CandidatePool;
