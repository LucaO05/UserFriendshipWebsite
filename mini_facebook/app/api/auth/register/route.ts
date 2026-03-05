import {NextResponse} from "next/server";
import {registerUser} from "@/lib/auth/service";
import {validateRegisterInput} from "@/lib/auth/validation";
import {toErrorResponse} from "@/lib/api/http-error";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const payload = validateRegisterInput(body);

        const user = await registerUser(payload);

        return NextResponse.json(
            {
                success: true,
                message: "Registrierung erfolgreich.",
                user,
            },
            {status: 201},
        );
    } catch (error) {
        return toErrorResponse(error);
    }
}