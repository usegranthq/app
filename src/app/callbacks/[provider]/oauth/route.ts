import { notFound, redirect, RedirectType } from 'next/navigation';
import { NextRequest } from 'next/server';

import api from '@/lib/api';
import { searchParamsToObject } from '@/utils/object';
import { getErrorMessage } from '@/utils/error';

interface RouteParams {
  params: {
    provider: string;
  };
}

const providers = ['github', 'google'];

export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!providers.includes(params.provider)) {
    return notFound();
  }

  const payload = searchParamsToObject(request.nextUrl.searchParams);

  try {
    await api(`/api/v1/verify/${params.provider}`, {
      method: 'POST',
      body: payload,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, `Failed to login to ${params.provider}`);
    redirect(`/login?redirect_error=${errorMessage}`, RedirectType.replace);
  }

  redirect('/u', RedirectType.replace);
}
