import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { NextResponse } from 'next/server';

export function withAuth(handler) {
  return async function (request, context) {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    request.user = decoded;
    return handler(request, context);
  };
}