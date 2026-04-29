const requestCounts = new Map();

export function withRateLimit(handler) {
  return async function (request, context) {
    const user = request.user;
    const identifier = user ? user.id : request.headers.get('x-forwarded-for') || 'unknown';
    const role = user?.role || 'unknown';

    // Admins have no limit
    if (role === 'admin') {
      return handler(request, context);
    }

    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 50; // agents: 50 per minute

    const key = `${identifier}`;
    const record = requestCounts.get(key);

    if (!record || now - record.startTime > windowMs) {
      requestCounts.set(key, { count: 1, startTime: now });
    } else {
      record.count += 1;
      if (record.count > maxRequests) {
        return new Response(
          JSON.stringify({ success: false, message: 'Rate limit exceeded. Try again later.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return handler(request, context);
  };
}