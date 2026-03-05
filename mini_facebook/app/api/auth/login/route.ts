import {NextResponse} from "next/server";
import {loginUser} from "@/lib/auth/service";
import {validateLoginInput} from "@/lib/auth/validation";
import {toErrorResponse} from "@/lib/api/http-error";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const payload = validateLoginInput(body);

        const user = await loginUser(payload);

        return NextResponse.json({
            success: true,
            message: "Login erfolgreich.",
            user,
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}