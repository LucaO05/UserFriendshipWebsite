import {NextResponse} from "next/server";
import {toErrorResponse} from "@/lib/api/http-error";
import {listFriendsByUsername} from "@/lib/friends/service";
import {validateFriendsUsername} from "@/lib/friends/validation";

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const username = validateFriendsUsername(searchParams.get("username"));

    const friends = await listFriendsByUsername(username);

    return NextResponse.json({
      success: true,
      friends,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
