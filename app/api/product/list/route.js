
import connectDB from "@/config/db";
import Product from "../../../../modals/Product";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
   
    await connectDB();
   const products = await Product.find({});
    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error("Error in /api/product/list:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}