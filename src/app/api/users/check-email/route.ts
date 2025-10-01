import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email } = reqBody;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check if user exists with this email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({
                error: "No account found with this email address",
                exists: false
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Email found",
            exists: true,
            isVerified: user.isVerified,
            userId: user._id
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

