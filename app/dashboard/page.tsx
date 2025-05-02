// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';
import DashboardClient from './DashboardClient';

interface ExtendedJwtPayload extends JwtPayload {
  email?: string;
}

export default function DashboardPage() {
  const token = cookies().get('token')?.value;
  const user = token ? (verifyToken(token) as ExtendedJwtPayload) : null;

  if (!user || !user.email) {
    redirect('/login');
  }

  return <DashboardClient email={user.email} />;
}
