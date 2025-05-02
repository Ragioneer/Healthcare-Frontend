// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = headers().get("x-invoke-path") || "";

  const hideSidebar = pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <html lang="en" className="bg-background text-foreground">
      <body className="flex min-h-screen font-sans antialiased">
        {/* Sidebar */}
        {!hideSidebar && (
          <aside className="w-64 bg-white text-gray-800 dark:bg-blue-950 dark:text-white border-r border-gray-200 dark:border-blue-800 p-6 flex flex-col gap-6">
            <div className="text-2xl font-extrabold text-blue-600 dark:text-white">
              MediQuick AI
            </div>
            <nav className="flex flex-col gap-3">
              <SidebarLink href="/chat" label="🧠 Chat" />
              <SidebarLink href="/appointments" label="📅 Schedule Appointment" />
              <SidebarLink href="/reception" label="💬 Talk to Receptionist" />
              <SidebarLink href="/exams" label="🧪 Book Lab Exam" />
              <SidebarLink href="/quote" label="📄 Get Quotation" />
              <SidebarLink href="/admin" label="🛠 Admin Panel" />
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition text-sm font-medium"
    >
      {label}
    </Link>
  );
}
