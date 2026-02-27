import { NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/errors';
import { loginUser } from '@/lib/auth/service';
import { validateLoginInput } from '@/lib/auth/validaiton';

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
    if (error instanceof ApiError) {
      return NextResponse.json({success: false, message: error.message}, {status: error.statusCode});
    }

    return NextResponse.json(
      {success: false, message: "Interner Serverfehler."},
      {status: 500},
    );
  }
}