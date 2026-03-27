import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/app/_components/ui/sonner";

export const metadata: Metadata = {
  title: "WorkZen - HR & Recruitment SaaS Platform",
  description: "A multi-tenant SaaS application that enables outsourcing companies to manage recruitment pipelines, employee data, and client assignments. The platform includes role-based access control, tenant-based data isolation, and a structured hiring workflow from candidate application to employee onboarding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={''}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
