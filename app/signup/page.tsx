'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import axios from 'axios';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      setStatus('❌ Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setStatus('⏳ Creating your account...');

    try {
      const res = await axios.post('http://localhost:8000/auth/signup', {
        email,
        password,
      });

      setStatus('✅ Signup successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setStatus(`❌ ${err.response?.data?.detail || 'Signup failed. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex justify-center items-center px-4">
      <Card className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl bg-white">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">📝 Create Your Account</h2>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm font-semibold">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isLoading}
              className="rounded-lg mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              disabled={isLoading}
              className="rounded-lg mt-1"
            />
          </div>

          <Button
            onClick={handleSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </Button>

          {status && (
            <div
              className={`text-center text-sm mt-3 font-medium ${
                status.includes('❌') ? 'text-red-600' : 'text-blue-700'
              }`}
            >
              {status}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
