"use client"
import { FileText, Plus, TrendingUp, UserPlus, Users, Briefcase, CalendarDays, DollarSign } from "lucide-react";
import { MetricCard } from "@/app/_components/MetricCard";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
} from "recharts";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/use-fetch";
import { getManpowerRequest } from "@/services/manpower_request.service";
import { getCandidates } from "@/services/candidate.service";
import { getEmployees } from "@/services/employee.service";
import { getAssignments } from "@/services/assignment.service";
import { getAttendances } from "@/services/attendance.service";
import { getPayrolls } from "@/services/payroll.service";
import { getListClient } from "@/services/client.service";

const barColors = ["#FF1654", "#FF4D7D", "#FF6B96", "#FF8AAF", "#FFA5C8"];
const pieColors = ["#FF1654", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount || 0);

const Overview = () => {
    const router = useRouter();

    const { data: mrData, loading: mrLoading } = useFetch(
        () => getManpowerRequest({ limit: 100 }), []
    );
    const { data: candidateData, loading: candidateLoading } = useFetch(
        () => getCandidates({ limit: 100 }), []
    );
    const { data: employeeData, loading: employeeLoading } = useFetch(
        () => getEmployees({ limit: 100 }), []
    );
    const { data: assignmentData, loading: assignmentLoading } = useFetch(
        () => getAssignments({ limit: 100 }), []
    );
    const { data: attendanceData, loading: attendanceLoading } = useFetch(
        () => getAttendances({ limit: 100 }), []
    );
    const { data: payrollData, loading: payrollLoading } = useFetch(
        () => getPayrolls({ limit: 100 }), []
    );
    const { data: clientData, loading: clientLoading } = useFetch(
        () => getListClient(), []
    );

    const isLoading = mrLoading || candidateLoading || employeeLoading || assignmentLoading;

    const manpowerRequests = mrData?.data ?? [];
    const candidates = candidateData?.data ?? [];
    const employees = employeeData?.data ?? [];
    const assignments = assignmentData?.data ?? [];
    const attendances = attendanceData?.data ?? [];
    const payrolls = payrollData?.data ?? [];
    const clients = clientData?.data ?? [];

    const totalEmployees = employeeData?.pagination?.total ?? employees.length;
    const totalCandidates = candidateData?.pagination?.total ?? candidates.length;
    const openRequests = manpowerRequests.filter((r: { status: string }) => r.status === "open" || r.status === "in_progress").length;
    const activeAssignments = assignments.filter((a: { status: string }) => a.status === "active").length;

    // Build chart: assignments per client
    const clientAssignmentMap: Record<string, { name: string; count: number }> = {};
    assignments.forEach((a: { client?: { id: number; company_name: string } }) => {
        if (a.client) {
            const key = String(a.client.id);
            if (!clientAssignmentMap[key]) {
                clientAssignmentMap[key] = { name: a.client.company_name, count: 0 };
            }
            clientAssignmentMap[key].count++;
        }
    });
    const assignmentsByClient = Object.values(clientAssignmentMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Build chart: attendance status distribution
    const attendanceStatusMap: Record<string, number> = {};
    attendances.forEach((a: { status: string }) => {
        attendanceStatusMap[a.status] = (attendanceStatusMap[a.status] || 0) + 1;
    });
    const attendancePieData = Object.entries(attendanceStatusMap).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    // Total net salary from payroll
    const totalNetSalary = payrolls.reduce((sum: number, p: { net_salary: number }) => sum + (p.net_salary || 0), 0);

    return (
        <div>
            {/* Page Title Section */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Talent Overview</h2>
                        <p className="text-sm text-gray-600 mt-1">Monitor your organization's health and growth.</p>
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
                        value={isLoading ? "..." : totalEmployees}
                        icon={Users}
                        iconColor="bg-gradient-to-br from-pink-500 to-rose-500"
                    />
                    <MetricCard
                        title="Open Requests"
                        value={isLoading ? "..." : openRequests}
                        icon={FileText}
                        iconColor="bg-gradient-to-br from-amber-500 to-orange-500"
                    />
                    <MetricCard
                        title="Candidates in Pipeline"
                        value={candidateLoading ? "..." : totalCandidates}
                        icon={UserPlus}
                        iconColor="bg-gradient-to-br from-green-500 to-emerald-500"
                    />
                    <MetricCard
                        title="Active Assignments"
                        value={assignmentLoading ? "..." : activeAssignments}
                        icon={Briefcase}
                        iconColor="bg-gradient-to-br from-blue-500 to-indigo-500"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-green-50 rounded-lg">
                                <CalendarDays className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Attendance Records</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {attendanceLoading ? <Skeleton className="w-12 h-7" /> : (attendanceData?.pagination?.total ?? attendances.length)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-50 rounded-lg">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Payroll (Net)</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {payrollLoading ? <Skeleton className="w-24 h-7" /> : formatCurrency(totalNetSalary)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-50 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Clients</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {clientLoading ? <Skeleton className="w-8 h-7" /> : clients.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Assignments per Client Bar Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Assignments per Client</h2>
                            <span className="text-xs text-gray-500 bg-pink-50 px-3 py-1 rounded-full">Current</span>
                        </div>
                        {assignmentLoading ? (
                            <Skeleton className="w-full h-[300px]" />
                        ) : assignmentsByClient.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={assignmentsByClient}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12, fill: "#6B7280" }}
                                        angle={-15}
                                        textAnchor="end"
                                        height={80}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: "#6B7280" }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                        }}
                                        cursor={{ fill: "rgba(255, 22, 84, 0.05)" }}
                                    />
                                    <Bar dataKey="count" name="Assignments" radius={[8, 8, 0, 0]} maxBarSize={50}>
                                        {assignmentsByClient.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-gray-400">
                                No assignment data available
                            </div>
                        )}
                    </div>

                    {/* Attendance Status Pie Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Attendance Distribution</h2>
                        </div>
                        {attendanceLoading ? (
                            <Skeleton className="w-full h-[300px]" />
                        ) : attendancePieData.length > 0 ? (
                            <div className="flex items-center gap-6">
                                <ResponsiveContainer width="60%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={attendancePieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={3}
                                        >
                                            {attendancePieData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "12px",
                                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-3">
                                    {attendancePieData.map((item, index) => (
                                        <div key={item.name} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                                            <span className="text-sm text-gray-700">{item.name}: <strong>{item.value}</strong></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-gray-400">
                                No attendance data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: "Employees", desc: "Manage employee data", href: "/org/employees", icon: Users, color: "from-pink-500 to-rose-500" },
                        { title: "Attendance", desc: "Track attendance records", href: "/org/attendance", icon: CalendarDays, color: "from-green-500 to-emerald-500" },
                        { title: "Payroll", desc: "Manage payroll & compensation", href: "/org/payroll", icon: DollarSign, color: "from-purple-500 to-indigo-500" },
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
