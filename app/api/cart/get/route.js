import toast from "react-hot-toast";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "../../../../modals/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await connectDB();
    const user = await User.findById(userId);
    const {cartItems} = user;
    toast.success('Cart fetched successfully')
    return NextResponse.json({ success: true, cartItems });
  } catch (err) {
    console.error("Error in /api/cart/get:", err);
    toast.error(err.message)
    return NextResponse.json({ success: false, message: err.message });
  }
  
}