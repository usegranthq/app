import api from '@/lib/api';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const supportedProviders: string[] = ['github', 'google'];

interface RouteParams {
  params: Promise<{ provider: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams): Promise<NextResponse | Response> {
  const { provider } = await params;
  const cookieStore = await cookies();

  if (!supportedProviders.includes(provider)) {
    return new Response('Unsupported provider', { status: 400 });
  }

  const hasInviteToken = cookieStore.has('_ug_invite');

  if (!hasInviteToken) {
    return new Response('Missing invite token', { status: 403 });
  }

  try {
    const response = await api.get<{ url: string }>(`v1/login/${provider}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.redirect(response.url);
  } catch {}

  return new Response('Something went wrong', { status: 500 });
}
