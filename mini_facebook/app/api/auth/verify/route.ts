import {NextResponse} from "next/server";
import {verifyEmailCode} from "@/lib/auth/service";
import {validateVerifyCodeInput} from "@/lib/auth/validation";
import {toErrorResponse} from "@/lib/api/http-error";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = validateVerifyCodeInput(body);

    const user = await verifyEmailCode(payload);

    return NextResponse.json({
      success: true,
      message: "E-Mail erfolgreich verifiziert.",
      user,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
