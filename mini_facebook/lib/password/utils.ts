import bcrypt from "bcrypt"

export async function hashPassword(password: string): Promise<string> {
    try {
        return await bcrypt.hash(password, 12);
    } catch (e) {
        throw new Error("Failed to hash password");
    }
}

export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        return false;
    }
}

export function isPasswordStrong(password: string): boolean {
    if (password.length < 8) return false;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber;
}