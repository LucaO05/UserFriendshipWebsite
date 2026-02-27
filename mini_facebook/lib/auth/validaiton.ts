import { ApiError } from '@/lib/api/errors';

import type { LoginInput, RegisterInput } from '@/lib/auth/types';
import { loginSchema, registerSchema } from '@/lib/auth/schema';

export function validateRegisterInput(payload: unknown): RegisterInput {
  const result = registerSchema.safeParse(payload);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Ungültige Daten.";
    throw new ApiError(message, 400);
  }

  return result.data;
}

export function validateLoginInput(payload: unknown): LoginInput {
  const result = loginSchema.safeParse(payload);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Ungültige Daten.";
    throw new ApiError(message, 400);
  }

  return result.data;
}