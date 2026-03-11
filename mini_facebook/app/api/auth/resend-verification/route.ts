import {NextResponse} from "next/server";
import {resendVerificationCode} from "@/lib/auth/service";
import {validateResendVerificationInput} from "@/lib/auth/validation";
import {toErrorResponse} from "@/lib/api/http-error";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = validateResendVerificationInput(body);

    await resendVerificationCode(payload);

    return NextResponse.json({
      success: true,
      message: "Neuer Verifizierungscode wurde gesendet.",
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
