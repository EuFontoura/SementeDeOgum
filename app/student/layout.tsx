import RouteGuard from "@/components/layout/RouteGuard";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRole="student">
      <Navbar />
      <Sidebar />
      <main className="ml-56 mt-16 min-h-[calc(100vh-4rem)] bg-green-50 p-6">
        {children}
      </main>
    </RouteGuard>
  );
}
