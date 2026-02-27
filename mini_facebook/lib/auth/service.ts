import {prisma} from "@/lib/prisma";
import {ApiError} from "@/lib/api/errors";
import {hashPassword, verifyPassword} from "@/lib/password/utils";
import type {LoginInput, RegisterInput} from "@/lib/auth/types";

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

    return user;
}

export async function loginUser(input: LoginInput) {
    const user = await prisma.user.findUnique({
        where: {email: input.email},
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

    const safeUser = {...user};
    delete safeUser.password;

    return safeUser;
}