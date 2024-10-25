import api from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

const supportedProviders: string[] = ['github', 'google'];

interface RouteParams {
  params: Promise<{ provider: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams): Promise<NextResponse | Response> {
  const { provider } = await params;

  if (!supportedProviders.includes(provider)) {
    return new Response('Unsupported provider', { status: 400 });
  }

  try {
    const response = await api.get<{ url: string }>(`v1/login/${provider}`);
    return NextResponse.redirect(response.url);
  } catch {}

  return new Response('Internal server error', { status: 500 });
}
