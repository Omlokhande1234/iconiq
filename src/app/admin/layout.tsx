"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar"; // Adjust path if your sidebar is located elsewhere

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if the user is on the login page
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    // Render only the login page content without the admin layout wrapper/sidebar
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  // Render the standard admin layout with the sidebar for all other admin routes
  return (
    <div className="flex min-h-screen bg-[#f4f8fc]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}