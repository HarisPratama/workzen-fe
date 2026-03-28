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
    UserCircle,
    Users
} from "lucide-react";
import Image from "next/image";
import {useState} from "react";
import {useRouter} from "next/navigation";
import { logout } from "@/services/auth.service";
import { useAuth } from "@/hooks/use-auth";
import { type MenuPage, getAccessibleMenus } from "@/lib/rbac";

interface MenuItem {
    title: string;
    icon: typeof Users;
    page: MenuPage;
}

const allMenuItems: { section: string; items: MenuItem[] }[] = [
    {
        section: "Organization",
        items: [
            { title: "Overview", icon: LayoutDashboard, page: "overview" },
            { title: "Employees", icon: Users, page: "employees" },
            { title: "Clients", icon: Building2, page: "clients" },
            { title: "Assignments", icon: Briefcase, page: "assignments" },
            { title: "Attendance", icon: CalendarDays, page: "attendance" },
        ],
    },
    {
        section: "Recruitment",
        items: [
            { title: "Manpower Requests", icon: ClipboardList, page: "manpower-request" },
            { title: "Talent Pool", icon: UserCircle, page: "candidates" },
        ],
    },
    {
        section: "HR Support",
        items: [
            { title: "Payroll", icon: DollarSign, page: "payroll" },
            { title: "Settings", icon: Settings, page: "settings" },
        ],
    },
];

interface AppSidebarProps {
    activeMenu: string;
    onMenuClick: (title: string, page: string) => void;
    accessibleMenus: MenuPage[];
}

function AppSidebar({ activeMenu, onMenuClick, accessibleMenus }: AppSidebarProps) {
    const filteredSections = allMenuItems
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => accessibleMenus.includes(item.page)),
        }))
        .filter((section) => section.items.length > 0);

    return (
        <Sidebar className="border-r border-gray-200 bg-white">
            <SidebarContent className="bg-white">
                {/* Logo */}
                <div className="p-6 flex items-center gap-3">
                    <Image src="/workzen.png" alt="WorkZen" width={120} height={120} className="rounded-lg" />
                </div>

                {filteredSections.map((section) => (
                    <SidebarGroup key={section.section}>
                        <SidebarGroupLabel className="px-6 text-xs text-gray-500 mb-2">{section.section}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => (
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
                ))}
            </SidebarContent>
        </Sidebar>
    );
}

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
    const [activeMenu, setActiveMenu] = useState("Overview");
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            // ignore logout API error
        } finally {
            window.location.href = "/login";
        }
    };

    const handleMenuClick = (title: string, page: string) => {
        setActiveMenu(title);
        router.push("/org/" + page);
    };

    const accessibleMenus = getAccessibleMenus(user?.role);

    const roleLabel: Record<string, string> = {
        SUPER_ADMIN: "Super Admin",
        TENANT_ADMIN: "Admin",
        SUPERVISOR: "Supervisor",
        EMPLOYEE: "Employee",
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gray-50">
                <AppSidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} accessibleMenus={accessibleMenus} />
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
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Search className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                                        <Bell className="w-5 h-5 text-gray-600" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
                                    </button>
                                    {/* User Profile */}
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {authLoading ? "..." : (user?.name ?? "User")}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {authLoading ? "" : (roleLabel[user?.role ?? ""] ?? user?.email ?? "")}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-rose-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {user?.name ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U"}
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
                        {children}
                    </div>

                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default SidebarLayout;
