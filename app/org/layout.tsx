"use client"
import SidebarLayout from "@/app/_components/Sidebar";
import { AuthProvider } from "@/hooks/use-auth";

export default function DashboardLayout({ children }: { children: React.ReactNode; }){
    return (
        <AuthProvider>
            <div className="bg-gray-50">
                <SidebarLayout>
                    {children}
                </SidebarLayout>
            </div>
        </AuthProvider>
    );
}
