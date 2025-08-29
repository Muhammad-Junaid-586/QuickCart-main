import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "../../../../modals/User";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    console.log("userId type:", typeof userId);
console.log("userId value:", userId);
console.log("Model _id type:", User.schema.paths._id.instance); // Should print "String"



    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Use findOne instead of findById to avoid casting issues
    // const user = await User.findOne({ _id: userId });
    const user = await User.findById(userId );

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Error in /api/user/data:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
