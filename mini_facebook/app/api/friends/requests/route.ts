import {NextResponse} from "next/server";
import {toErrorResponse} from "@/lib/api/http-error";
import {
  handleFriendRequest,
  listIncomingRequests,
  sendFriendRequest,
} from "@/lib/friends/service";
import {
  validateFriendsUsername,
  validateHandleRequestInput,
  validateSendRequestInput,
} from "@/lib/friends/validation";

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const username = validateFriendsUsername(searchParams.get("username"));

    const requests = await listIncomingRequests(username);

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = validateSendRequestInput(body);

    const friendRequest = await sendFriendRequest(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Freundschaftsanfrage gesendet.",
        friendRequest,
      },
      {status: 201},
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const payload = validateHandleRequestInput(body);

    await handleFriendRequest(payload);

    return NextResponse.json({
      success: true,
      message: payload.action === "accept" ? "Anfrage angenommen." : "Anfrage abgelehnt.",
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
