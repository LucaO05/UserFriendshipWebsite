import {z} from "zod";
import {ApiError} from "@/lib/api/errors";

const usernameSchema = z
  .string({required_error: "Username ist erforderlich."})
  .trim()
  .min(1, "Username ist erforderlich.")
  .transform((value) => value.toLowerCase());

const sendRequestSchema = z.object({
  senderUsername: usernameSchema,
  targetUsername: usernameSchema,
});

const handleRequestSchema = z.object({
  requestId: z.string({required_error: "requestId ist erforderlich."}).trim().uuid("Ungültige requestId."),
  username: usernameSchema,
  action: z.enum(["accept", "reject"], {errorMap: () => ({message: "Ungültige Aktion."})}),
});

export function validateFriendsUsername(value: unknown) {
  const result = usernameSchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(result.error.issues[0]?.message ?? "Ungültige Daten.", 400);
  }

  return result.data;
}

export function validateSendRequestInput(payload: unknown) {
  const result = sendRequestSchema.safeParse(payload);

  if (!result.success) {
    throw new ApiError(result.error.issues[0]?.message ?? "Ungültige Daten.", 400);
  }

  return result.data;
}

export function validateHandleRequestInput(payload: unknown) {
  const result = handleRequestSchema.safeParse(payload);

  if (!result.success) {
    throw new ApiError(result.error.issues[0]?.message ?? "Ungültige Daten.", 400);
  }

  return result.data;
}
