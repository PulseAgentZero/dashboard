import { SidebarProvider } from "@/lib/sidebar-context";
import Sidebar from "@/layout/sidebar";
import Nav from "@/layout/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#f6f8fb]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Nav />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
