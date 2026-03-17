"use client"
import {FileText, Plus, TrendingUp, UserPlus, Users} from "lucide-react";
import {MetricCard} from "@/app/_components/MetricCard";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Funnel,
    FunnelChart, LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {ActivityItem} from "@/app/_components/ActivityItem";

// Mock data for charts
const hiringPerClientData = [
    { client: "PT Maju Jaya", hired: 45 },
    { client: "CV Sukses Mandiri", hired: 32 },
    { client: "PT Global Tech", hired: 28 },
    { client: "PT Sejahtera Abadi", hired: 24 },
    { client: "CV Karya Bersama", hired: 18 },
];

const pipelineFunnelData = [
    { name: "Applications", value: 450, fill: "#FF1654" },
    { name: "Screening", value: 280, fill: "#FF4D7D" },
    { name: "Interview", value: 120, fill: "#FF6B96" },
    { name: "Offer", value: 65, fill: "#FF8AAF" },
    { name: "Hired", value: 42, fill: "#10b981" },
];

// Mock recent activities
const recentActivities = [
    {
        type: "interview" as const,
        title: "Interview Scheduled",
        description: "John Doe - Software Engineer at PT Maju Jaya",
        time: "2 hours ago",
    },
    {
        type: "hired" as const,
        title: "Candidate Hired",
        description: "Sarah Williams - Marketing Manager at CV Sukses Mandiri",
        time: "4 hours ago",
    },
    {
        type: "request" as const,
        title: "New Manpower Request",
        description: "PT Global Tech - 5 Data Analysts needed",
        time: "5 hours ago",
    },
    {
        type: "candidate" as const,
        title: "New Candidate Added",
        description: "Michael Chen - UI/UX Designer",
        time: "6 hours ago",
    },
    {
        type: "interview" as const,
        title: "Interview Completed",
        description: "Emma Rodriguez - HR Specialist at PT Sejahtera Abadi",
        time: "8 hours ago",
    },
    {
        type: "candidate" as const,
        title: "New Candidate Added",
        description: "David Park - DevOps Engineer",
        time: "1 day ago",
    },
];

const barColors = ["#FF1654", "#FF4D7D", "#FF6B96", "#FF8AAF", "#FFA5C8"];

const Overview = () => {

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
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Export Report
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium shadow-sm">
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
                        title="Open Requests"
                        value={1248}
                        icon={Users}
                        iconColor="bg-gradient-to-br from-pink-500 to-rose-500"
                        trend={{ value: "+4.2%", isPositive: true }}
                    />
                    <MetricCard
                        title="Candidates in Pipeline"
                        value={34}
                        icon={UserPlus}
                        iconColor="bg-gradient-to-br from-green-500 to-emerald-500"
                        trend={{ value: "+12%", isPositive: true }}
                    />
                    <MetricCard
                        title="Interview Today"
                        value={18}
                        icon={FileText}
                        iconColor="bg-gradient-to-br from-amber-500 to-orange-500"
                        trend={{ value: "Across 4 depts", isPositive: true }}
                    />
                    <MetricCard
                        title="Hired This Month"
                        value="2.4%"
                        icon={TrendingUp}
                        iconColor="bg-gradient-to-br from-rose-500 to-pink-500"
                        trend={{ value: "+0.5%", isPositive: true }}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Hiring per Client Bar Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Hiring per Client</h2>
                            <span className="text-xs text-gray-500 bg-pink-50 px-3 py-1 rounded-full">This Year</span>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={hiringPerClientData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                                <XAxis
                                    dataKey="client"
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
                                <Bar dataKey="hired" radius={[8, 8, 0, 0]} maxBarSize={50}>
                                    {hiringPerClientData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pipeline Funnel Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Recruitment Pipeline</h2>
                            <button className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1">
                                <span>Filter</span>
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <FunnelChart>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                <Funnel dataKey="value" data={pipelineFunnelData}>
                                    <LabelList position="right" fill="#374151" stroke="none" dataKey="name" style={{ fontSize: "14px", fontWeight: 500 }} />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                        <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">View All</button>
                    </div>
                    <div className="space-y-1">
                        {recentActivities.map((activity, index) => (
                            <ActivityItem key={index} {...activity} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview;
