import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-blue-100 p-4 space-y-4">
          <h2 className="text-xl font-bold">Chatgpt Style Medical Chat</h2>
          <nav className="flex flex-col space-y-2">
            <Link href="/chat">Chat</Link>
            <Link href="/appointments">Schedule an Appointment</Link>
            <Link href="/reception">Connect to a Receptionist</Link>
            <Link href="/exams">Schedule an Exam</Link>
            <Link href="/quote">Request a Quotation</Link>
            <Link href="/admin">Admin Panel</Link>
          </nav>
        </div>

        {/* Main View */}
        <div className="flex-1 p-6 bg-gray-50">{children}</div>
      </body>
    </html>
  );
}
