import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "../../../../modals/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  
  const { userId } = getAuth(request);
  const { cartData } = await request.json();

  try {
    await connectDB();
    // await User.findOneAndUpdate({ _id: userId }, { cartItems: cartData });
    const user = await User.findById(userId);
    user.cartItems = cartData;
    await user.save();
    return NextResponse.json({ success: true, message: "Cart updated successfully" });
  } catch (err) {
    console.error("Error in /api/cart/update:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}