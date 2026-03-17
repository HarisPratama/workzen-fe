import SidebarLayout from "@/app/_components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode; }){
    return (
        <div className="bg-gray-50">
            <SidebarLayout>
                {children}
            </SidebarLayout>
        </div>
    );
}