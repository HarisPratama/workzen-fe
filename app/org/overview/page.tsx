"use client"
import { FileText, Plus, Users, Briefcase, CalendarDays, DollarSign, UserPlus, ClipboardList, MessageSquare, Gift } from "lucide-react";
import { MetricCard } from "@/app/_components/MetricCard";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/use-fetch";
import { getOverview } from "@/services/overview.service";

const Overview = () => {
    const router = useRouter();

    const { data: overviewData, loading } = useFetch(() => getOverview(), []);
    const overview = overviewData?.data;

    return (
        <div>
            {/* Page Title Section */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Talent Overview</h2>
                        <p className="text-sm text-gray-600 mt-1">Monitor your organization&#39;s health and growth.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push("/org/employees/create")}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Employee
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-8 py-8">
                {/* Top Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Employees"
                        value={loading ? "..." : (overview?.total_employees ?? 0)}
                        icon={Users}
                        iconColor="bg-gradient-to-br from-pink-500 to-rose-500"
                    />
                    <MetricCard
                        title="Manpower Requests"
                        value={loading ? "..." : (overview?.total_manpower_requests ?? 0)}
                        icon={FileText}
                        iconColor="bg-gradient-to-br from-amber-500 to-orange-500"
                    />
                    <MetricCard
                        title="Candidates"
                        value={loading ? "..." : (overview?.total_candidates ?? 0)}
                        icon={UserPlus}
                        iconColor="bg-gradient-to-br from-green-500 to-emerald-500"
                    />
                    <MetricCard
                        title="Active Assignments"
                        value={loading ? "..." : (overview?.total_assignments ?? 0)}
                        icon={Briefcase}
                        iconColor="bg-gradient-to-br from-blue-500 to-indigo-500"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-50 rounded-lg">
                                <ClipboardList className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Applications</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? <Skeleton className="w-12 h-7" /> : (overview?.total_candidate_applications ?? 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-green-50 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Interviews</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? <Skeleton className="w-12 h-7" /> : (overview?.total_interviews ?? 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-50 rounded-lg">
                                <Gift className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Offers</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? <Skeleton className="w-12 h-7" /> : (overview?.total_offers ?? 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 rounded-lg">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Clients</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? <Skeleton className="w-12 h-7" /> : (overview?.total_clients ?? 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: "Employees", desc: "Manage employee data", href: "/org/employees", icon: Users, color: "from-pink-500 to-rose-500" },
                        { title: "Attendance", desc: "Track attendance records", href: "/org/attendance", icon: CalendarDays, color: "from-green-500 to-emerald-500" },
                        { title: "Clients", desc: "Manage client companies", href: "/org/clients", icon: DollarSign, color: "from-purple-500 to-indigo-500" },
                        { title: "Assignments", desc: "View client assignments", href: "/org/assignments", icon: Briefcase, color: "from-blue-500 to-cyan-500" },
                    ].map((item) => (
                        <button
                            key={item.title}
                            onClick={() => router.push(item.href)}
                            className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md transition-shadow group"
                        >
                            <div className={`p-2.5 bg-gradient-to-br ${item.color} rounded-lg w-fit mb-3`}>
                                <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">{item.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Overview;
