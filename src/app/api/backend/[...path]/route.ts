// proxy to backend

import api from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');

  try {
    const response = await api.get(path);
    return NextResponse.json(response.data);
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');

  let payload = {};

  try {
    payload = await request.json();
  } catch {}

  try {
    const response = await api.post(path, payload);
    return NextResponse.json(response.data);
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
