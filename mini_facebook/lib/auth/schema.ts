import { z } from 'zod';

const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const loginSchema = z.object({
    email: z
        .string({required_error: "E-Mail ist erforderlich."})
        .trim()
        .email("Bitte eine gültige E-Mail angeben.")
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
