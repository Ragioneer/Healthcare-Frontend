// Server-side API route
import { NextResponse } from 'next/server';

export async function GET() {
  // Log on server
  console.log('Server-side NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Server-side NODE_ENV:', process.env.NODE_ENV);
  
  return NextResponse.json({
    nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL || 'undefined',
    nodeEnv: process.env.NODE_ENV,
    message: 'Check server logs for more details'
  });
} 