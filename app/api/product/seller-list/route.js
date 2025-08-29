import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Product from "../../../../modals/Product";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
   const products = await Product.find({});
    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error("Error in /api/product/list:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}