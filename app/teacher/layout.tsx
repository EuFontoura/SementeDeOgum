import RouteGuard from "@/components/layout/RouteGuard";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

const teacherLinks = [
  { href: "/teacher", label: "Dashboard", icon: "📋" },
  { href: "/teacher/exam/new", label: "Criar Simulado", icon: "✏️" },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRole="teacher">
      <Navbar />
      <Sidebar links={teacherLinks} basePath="/teacher" />
      <main className="ml-56 mt-16 min-h-[calc(100vh-4rem)] bg-green-50 p-6">
        {children}
      </main>
    </RouteGuard>
  );
}
