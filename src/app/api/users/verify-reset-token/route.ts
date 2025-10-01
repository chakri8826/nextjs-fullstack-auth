import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } })
        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        return NextResponse.json({ message: "Token verified successfully", success: true });
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}