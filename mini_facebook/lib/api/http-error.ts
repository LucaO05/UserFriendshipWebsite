import {NextResponse} from "next/server";
import {ApiError} from "@/lib/api/errors";

export function toErrorResponse(error: unknown) {
    if (error instanceof ApiError) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {status: error.statusCode},
        );
    }

    console.error("Unerwarteter API-Fehler:", error);

    return NextResponse.json(
        {
            success: false,
            message: "Ein unerwarteter Fehler ist aufgetreten.",
        },
        {status: 500},
    );
}
