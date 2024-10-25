import api from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

const supportedProviders = ['github', 'google'];

interface RouteParams {
  params: {
    provider: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { provider } = params;

  if (!supportedProviders.includes(provider)) {
    return new Response('Unsupported provider', { status: 400 });
  }

  try {
    const response = await api.get(`v1/login/${provider}`);
    return NextResponse.redirect(response.url);
  } catch {}

  return new Response('Internal server error', { status: 500 });
}
