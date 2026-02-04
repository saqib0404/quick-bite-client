import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";

export async function PATCH(req: Request) {
    const body = await req.json();
    const result = await userService.updateMe(body);
    return NextResponse.json(result, { status: result.error ? 400 : 200 });
}
