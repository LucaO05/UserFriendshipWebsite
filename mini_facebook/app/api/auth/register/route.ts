import {NextResponse} from "next/server";
import {ApiError} from "@/lib/api/errors";
import {registerUser} from "@/lib/auth/service";
import {validateRegisterInput} from "@/lib/auth/validaiton";

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
        if (error instanceof ApiError) {
            return NextResponse.json({success: false, message: error.message}, {status: error.statusCode});
        }

        return NextResponse.json(
            {success: false, message: "Interner Serverfehler."},
            {status: 500},
        );
    }
}