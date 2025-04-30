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
      const response = await axios.post('http://localhost:8000/auth/login', {
        email,
        password,
      });

      const { access_token } = response.data;

      Cookies.set('token', access_token, { expires: 1 }); // 1 day expiry
      router.push('/');
    } catch (error: any) {
      setErrorMsg(error.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <Card className="max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button onClick={handleLogin} className="w-full">Login</Button>

          {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
