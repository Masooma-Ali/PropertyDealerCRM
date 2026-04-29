import { NextResponse } from 'next/server';

export function withRole(...allowedRoles) {
  return function (handler) {
    return async function (request, context) {
      const user = request.user;

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { success: false, message: 'Access denied: insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(request, context);
    };
  };
}