import { z } from 'zod';

const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const loginSchema = z.object({
    identifier: z
        .string({required_error: "E-Mail oder Username ist erforderlich."})
        .trim()
        .min(1, "E-Mail oder Username ist erforderlich.")
        .transform((value) => value.toLowerCase()),
    password: z
        .string({required_error: "Passwort ist erforderlich."})
        .min(1, "Passwort darf nicht leer sein."),
});

export const registerSchema = z.object({
    firstName: z
        .string({required_error: "Vorname ist erforderlich."})
        .trim()
        .min(1, "Vorname darf nicht leer sein."),
    lastName: z
        .string({required_error: "Nachname ist erforderlich."})
        .trim()
        .min(1, "Nachname darf nicht leer sein."),
    username: z
        .string({required_error: "Username ist erforderlich."})
        .trim()
        .min(1, "Username darf nicht leer sein.")
        .transform((value) => value.toLowerCase()),
    email: z
        .string({required_error: "E-Mail ist erforderlich."})
        .trim()
        .email("Bitte eine gültige E-Mail angeben.")
        .transform((value) => value.toLowerCase()),
    password: z
        .string({required_error: "Passwort ist erforderlich."})
        .regex(
            passwordStrengthRegex,
            "Passwort ist zu schwach (mind. 8 Zeichen, Groß-/Kleinbuchstabe und Zahl).",
        ),
});

export const updateUsernameSchema = z.object({
    email: z
        .string({required_error: "E-Mail ist erforderlich."})
        .trim()
        .email("Bitte eine gültige E-Mail angeben.")
        .transform((value) => value.toLowerCase()),
    username: z
        .string({required_error: "Username ist erforderlich."})
        .trim()
        .min(1, "Username darf nicht leer sein.")
        .transform((value) => value.toLowerCase()),
});

export const updatePasswordSchema = z.object({
    email: z
        .string({required_error: "E-Mail ist erforderlich."})
        .trim()
        .email("Bitte eine gültige E-Mail angeben.")
        .transform((value) => value.toLowerCase()),
    oldPassword: z
        .string({required_error: "Altes Passwort ist erforderlich."})
        .min(1, "Altes Passwort darf nicht leer sein."),
    newPassword: z
        .string({required_error: "Neues Passwort ist erforderlich."})
        .regex(
            passwordStrengthRegex,
            "Passwort ist zu schwach (mind. 8 Zeichen, Groß-/Kleinbuchstabe und Zahl).",
        ),
});

export const verifyCodeSchema = z.object({
    email: z
        .string({required_error: "E-Mail ist erforderlich."})
        .trim()
        .email("Bitte eine gültige E-Mail angeben.")
        .transform((value) => value.toLowerCase()),
    code: z
        .string({required_error: "Code ist erforderlich."})
        .trim()
        .regex(/^\d{6}$/, "Code muss 6-stellig sein."),
});

export const resendVerificationSchema = z.object({
    email: z
        .string({required_error: "E-Mail ist erforderlich."})
        .trim()
        .email("Bitte eine gültige E-Mail angeben.")
        .transform((value) => value.toLowerCase()),
});
