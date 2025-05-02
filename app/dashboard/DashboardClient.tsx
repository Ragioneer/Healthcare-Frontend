// app/dashboard/DashboardClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardClient({ email }: { email: string }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      <p className="mt-2 text-gray-600">Logged in as {email}</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
