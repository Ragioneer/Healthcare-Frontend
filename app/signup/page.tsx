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
      setStatus('❌ Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setStatus('⏳ Creating your account...');

    try {
      console.log('Attempting signup with:', { email });
      const res = await axios.post('http://localhost:8000/auth/signup', {
        email,
        password,
      });
      console.log('Signup response:', res.data);

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
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Create an Account</h2>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleSignup} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </Button>

          {status && (
            <p className={`text-sm text-center mt-2 ${status.includes('❌') ? 'text-red-600' : 'text-blue-600'}`}>
              {status}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
