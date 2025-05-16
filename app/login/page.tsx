// app/login/page.tsx

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });

      const { access_token } = response.data;
      Cookies.set('token', access_token, { expires: 1 });
      router.push('/dashboard');
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401) {
        setErrorMsg('Invalid email or password. Please sign up if you don’t have an account.');
      } else {
        setErrorMsg('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex justify-center items-center px-4">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-xl rounded-2xl bg-white">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">🔐 Login to Your Account</h2>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm font-semibold">Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg mt-1"
            />
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2"
          >
            Login
          </Button>

          {errorMsg && (
            <div className="text-center text-sm text-red-600 font-medium mt-2">
              {errorMsg}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
