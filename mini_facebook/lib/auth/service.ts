import {prisma} from "@/lib/prisma";
import {ApiError} from "@/lib/api/errors";
import {hashPassword, verifyPassword} from "@/lib/password/utils";
import {generateVerificationCode, getVerificationExpiry} from "@/lib/auth/verification";
import {sendVerificationCodeEmail} from "@/lib/mail/verification";
import type {
    LoginInput,
    ResendVerificationInput,
    RegisterInput,
    VerifyCodeInput,
    UpdatePasswordInput,
    UpdateUsernameInput,
} from "@/lib/auth/types";

export async function registerUser(input: RegisterInput) {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{email: input.email}, {username: input.username}],
        },
        select: {id: true, email: true, username: true},
    });

    if (existingUser?.email === input.email) {
        throw new ApiError("Diese E-Mail wird bereits verwendet.", 409);
    }

    if (existingUser?.username === input.username) {
        throw new ApiError("Dieser Username ist bereits vergeben.", 409);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
        data: {
            firstName: input.firstName,
            lastName: input.lastName,
            username: input.username,
            email: input.email,
            password: passwordHash,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            isVerified: true,
            createdAt: true,
        },
    });

    await createAndSendVerificationCode(user.id, user.email);

    return user;
}

export async function loginUser(input: LoginInput) {
    const user = await prisma.user.findFirst({
        where: {
            OR: [{email: input.identifier}, {username: input.identifier}],
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            password: true,
            isVerified: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new ApiError("Ungültige Zugangsdaten.", 401);
    }

    const isValidPassword = await verifyPassword(input.password, user.password);

    if (!isValidPassword) {
        throw new ApiError("Ungültige Zugangsdaten.", 401);
    }

    if (!user.isVerified) {
        await createAndSendVerificationCode(user.id, user.email);
        throw new ApiError("Bitte verifiziere zuerst deine E-Mail.", 403, {
            requiresVerification: true,
            email: user.email,
        });
    }

    const {password: _password, ...safeUser} = user;
    return safeUser;
}

export async function updateUsername(input: UpdateUsernameInput) {
    const user = await prisma.user.findUnique({
        where: {email: input.email},
        select: {id: true},
    });

    if (!user) {
        throw new ApiError("User nicht gefunden.", 404);
    }

    const existingUser = await prisma.user.findUnique({
        where: {username: input.username},
        select: {id: true},
    });

    if (existingUser && existingUser.id !== user.id) {
        throw new ApiError("Dieser Username ist bereits vergeben.", 409);
    }

    return prisma.user.update({
        where: {id: user.id},
        data: {username: input.username},
        select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            isVerified: true,
            createdAt: true,
        },
    });
}

export async function updatePassword(input: UpdatePasswordInput) {
    const user = await prisma.user.findUnique({
        where: {email: input.email},
        select: {id: true, password: true},
    });

    if (!user) {
        throw new ApiError("User nicht gefunden.", 404);
    }

    const isValidPassword = await verifyPassword(input.oldPassword, user.password);

    if (!isValidPassword) {
        throw new ApiError("Das alte Passwort ist falsch.", 401);
    }

    const passwordHash = await hashPassword(input.newPassword);

    await prisma.user.update({
        where: {id: user.id},
        data: {password: passwordHash},
    });
}

export async function verifyEmailCode(input: VerifyCodeInput) {
    const user = await prisma.user.findUnique({
        where: {email: input.email},
        select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            isVerified: true,
            verificationToken: true,
            verificationTokenExpiresAt: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new ApiError("User nicht gefunden.", 404);
    }

    if (user.isVerified) {
        const {verificationToken: _token, verificationTokenExpiresAt: _expiresAt, ...safeUser} = user;
        return safeUser;
    }

    const isExpired = !user.verificationTokenExpiresAt || user.verificationTokenExpiresAt < new Date();
    const isInvalidCode = user.verificationToken !== input.code;

    if (isExpired || isInvalidCode) {
        await createAndSendVerificationCode(user.id, user.email);
        throw new ApiError(
            "Code ungültig oder abgelaufen. Ein neuer Code wurde gesendet.",
            400,
            {requiresVerification: true, email: user.email},
        );
    }

    const verifiedUser = await prisma.user.update({
        where: {id: user.id},
        data: {
            isVerified: true,
            verificationToken: null,
            verificationTokenExpiresAt: null,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            isVerified: true,
            createdAt: true,
        },
    });

    return verifiedUser;
}

export async function resendVerificationCode(input: ResendVerificationInput) {
    const user = await prisma.user.findUnique({
        where: {email: input.email},
        select: {id: true, email: true, isVerified: true},
    });

    if (!user) {
        throw new ApiError("User nicht gefunden.", 404);
    }

    if (user.isVerified) {
        throw new ApiError("E-Mail ist bereits verifiziert.", 409);
    }

    await createAndSendVerificationCode(user.id, user.email);
}

async function createAndSendVerificationCode(userId: string, email: string) {
    const code = generateVerificationCode();

    await prisma.user.update({
        where: {id: userId},
        data: {
            verificationToken: code,
            verificationTokenExpiresAt: getVerificationExpiry(),
        },
    });

    await sendVerificationCodeEmail(email, code);
}
