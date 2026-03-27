"use client"
import {
    SidebarContent,
    SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
    Sidebar
} from "@/app/_components/ui/sidebar";
import {
    Bell,
    Briefcase,
    Building2,
    CalendarDays,
    ClipboardList,
    DollarSign,
    LayoutDashboard,
    LogOut,
    Search, Settings,
    TrendingUp, UserCircle,
    UserPlus,
    Users
} from "lucide-react";
import Image from "next/image";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import { getUserProfile } from "@/services/user.service";
import { logout } from "@/services/auth.service";
import { toast } from "sonner";

interface AppSidebarProps {
    activeMenu: string;
    onMenuClick: (title: string, page: PageType) => void;
}

type PageType = "dashboard" | "manpower-requests" | "manpower-create" | "manpower-detail";

const organizationMenuItems = [
    { title: "Overview", icon: LayoutDashboard, page: "overview" as PageType },
    { title: "Employees", icon: Users, page: "employees" as PageType },
    { title: "Clients", icon: Building2, page: "clients" as PageType },
    { title: "Assignments", icon: Briefcase, page: "assignments" as PageType },
    { title: "Attendance", icon: CalendarDays, page: "attendance" as PageType },
    { title: "Manpower Requests", icon: ClipboardList, page: "manpower-request" as PageType },
    { title: "Talent Pool", icon: UserCircle, page: "candidates" as PageType },
];

const managementMenuItems = [
    { title: "Performance", icon: TrendingUp, page: "overview" as PageType },
];

const supportMenuItems = [
    { title: "Payroll", icon: DollarSign, page: "payroll" as PageType },
    { title: "Settings", icon: Settings, page: "overview" as PageType },
];

function AppSidebar({ activeMenu, onMenuClick }: AppSidebarProps) {
    return (
        <Sidebar className="border-r border-gray-200 bg-white">
            <SidebarContent className="bg-white">
                {/* Logo */}
                <div className="p-6 flex items-center gap-3">
                    <Image src="/workzen.png" alt="WorkZen" width={32} height={32} className="rounded-lg" />
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">WorkZen</h2>
                    </div>
                </div>

                {/* Organization Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-6 text-xs text-gray-500 mb-2">Organization</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {organizationMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={activeMenu === item.title}
                                        onClick={() => onMenuClick(item.title, item.page)}
                                        className="px-6"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Management Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-6 text-xs text-gray-500 mb-2">Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={activeMenu === item.title}
                                        onClick={() => onMenuClick(item.title, item.page)}
                                        className="px-6"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* HR Support Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="px-6 text-xs text-gray-500 mb-2">HR Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {supportMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={activeMenu === item.title}
                                        onClick={() => onMenuClick(item.title, item.page)}
                                        className="px-6"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

const SidebarLayout = (
    {
        children, // This will be the page content (overview, employee, etc.)
    }: {
        children: React.ReactNode;
    }
) => {
    const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
    const [activeMenu, setActiveMenu] = useState("Recruitment");
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<{ name: string; email: string; role?: string } | null>(null);
    const route = useRouter();

    useEffect(() => {
        getUserProfile()
            .then((res) => setUserProfile(res.data ?? res))
            .catch(() => {});
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            // ignore logout API error
        } finally {
            window.location.href = "/login";
        }
    };

    const handleMenuClick = (title: string, page: PageType) => {
        setActiveMenu(title);
        setCurrentPage(page);
        route.push("/org/" + page);
        setSelectedRequestId(null);
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gray-50">
                <AppSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
                <SidebarInset className="flex-1">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                        <div className="px-8 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <SidebarTrigger />
                                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* Search */}
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Search className="w-5 h-5 text-gray-600" />
                                    </button>
                                    {/* Notifications */}
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                                        <Bell className="w-5 h-5 text-gray-600" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
                                    </button>
                                    {/* User Profile */}
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">{userProfile?.name ?? "User"}</p>
                                            <p className="text-xs text-gray-600">{userProfile?.role ?? userProfile?.email ?? ""}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {userProfile?.name ? userProfile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U"}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                            title="Logout"
                                        >
                                            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="min-h-screen flex flex-col bg-gray-50">
                        { children }
                    </div>

                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default SidebarLayout;
