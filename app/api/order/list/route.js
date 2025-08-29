import connectDB from "@/config/db";
import Order from "@/modals/Order";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/modals/Product";
import Address from "@/modals/Address";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    console.log("User ID from auth:", userId);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    console.log("Connected to DB");

    // First, let's check if we have any orders at all
    const allOrders = await Order.find({});
    console.log("All orders in DB:", allOrders);
    
    // Now check orders for this specific user
    const userOrders = await Order.find({ userId });
    console.log("Orders for user:", userOrders);
    
    if (userOrders.length === 0) {
      console.log("No orders found for user");
      return NextResponse.json({ success: true, orders: [] });
    }

    // Try populating with the exact model names
    const orders = await Order.find({ userId })
      .populate("items.product")  // Try simple populate first
      .populate("address")
      .sort({ date: -1 });

    console.log('Populated orders:', orders);
    
    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error("Error in /api/order/list:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}