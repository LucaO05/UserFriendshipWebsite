export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly payload?: Record<string, unknown>;

    constructor(message: string, statusCode: number, payload?: Record<string, unknown>) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.payload = payload;
    }
}
