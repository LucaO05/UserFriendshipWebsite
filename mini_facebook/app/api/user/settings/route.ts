import {NextResponse} from "next/server";
import {ApiError} from "@/lib/api/errors";
import {toErrorResponse} from "@/lib/api/http-error";
import {
    validateUpdatePasswordInput,
    validateUpdateUsernameInput,
} from "@/lib/auth/validation";
import {updatePassword, updateUsername} from "@/lib/auth/service";

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const action = body?.action;

        if (action === "username") {
            const payload = validateUpdateUsernameInput(body);
            const user = await updateUsername(payload);

            return NextResponse.json({
                success: true,
                message: "Username wurde aktualisiert.",
                user,
            });
        }

        if (action === "password") {
            const payload = validateUpdatePasswordInput(body);
            await updatePassword(payload);

            return NextResponse.json({
                success: true,
                message: "Passwort wurde aktualisiert.",
            });
        }

        throw new ApiError("Ungültige Aktion.", 400);
    } catch (error) {
        return toErrorResponse(error);
    }
}
