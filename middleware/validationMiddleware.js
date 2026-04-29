import { NextResponse } from 'next/server';

export function validateBody(schema) {
  return function (handler) {
    return async function (request, context) {
      let body;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { success: false, message: 'Invalid JSON body' },
          { status: 400 }
        );
      }

      const errors = [];
      for (const [field, rules] of Object.entries(schema)) {
        const value = body[field];

        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }

        if (value !== undefined && rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
        }

        if (rules.enum && value && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }

        if (rules.minLength && value && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
      }

      if (errors.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Validation failed', errors },
          { status: 400 }
        );
      }

      request.validatedBody = body;
      return handler(request, context);
    };
  };
}