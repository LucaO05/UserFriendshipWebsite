import { ApiError } from '@/lib/api/errors';

import type {
  LoginInput,
  RegisterInput,
  ResendVerificationInput,
  VerifyCodeInput,
  UpdatePasswordInput,
  UpdateUsernameInput,
} from '@/lib/auth/types';
import {
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  verifyCodeSchema,
  updatePasswordSchema,
  updateUsernameSchema,
} from '@/lib/auth/schema';

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

export function validateUpdateUsernameInput(payload: unknown): UpdateUsernameInput {
  const result = updateUsernameSchema.safeParse(payload);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Ungültige Daten.";
    throw new ApiError(message, 400);
  }

  return result.data;
}

export function validateUpdatePasswordInput(payload: unknown): UpdatePasswordInput {
  const result = updatePasswordSchema.safeParse(payload);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Ungültige Daten.";
    throw new ApiError(message, 400);
  }

  return result.data;
}

export function validateVerifyCodeInput(payload: unknown): VerifyCodeInput {
  const result = verifyCodeSchema.safeParse(payload);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Ungültige Daten.";
    throw new ApiError(message, 400);
  }

  return result.data;
}

export function validateResendVerificationInput(payload: unknown): ResendVerificationInput {
  const result = resendVerificationSchema.safeParse(payload);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Ungültige Daten.";
    throw new ApiError(message, 400);
  }

  return result.data;
}
