// import connectDB from "@/config/db";
// import Address from "@/modals/Address";
// import {  getAuth } from "@clerk/nextjs/server";

// import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     // const { userId } =   getAuth(request);
//     const { userId } =   getAuth(request);
//     console.log("userId:", userId);
    
//     await connectDB();
//     const addresses = await Address.find({ userId });
//     console.log(addresses);
    
//     return NextResponse.json({ success: true, addresses });
//   } catch (err) {
//     console.error("Error in /api/user/get-address:", err);
//     return NextResponse.json({ success: false, message: err.message });
//   }
// }


import {getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
// import User from "../../../../modals/User";
import Address from "@/modals/Address";
import { NextResponse } from "next/server";

export async function GET(request) {
  
  const data = getAuth(request);
  
  console.log("data:", data);
  
  const { userId } = data;

  try {
     await connectDB();
    const addresses = await Address.find({ userId });
    console.log(addresses);
    
    return NextResponse.json({ success: true, addresses });
  } catch (err) {
    console.error("Error in /api/user/get-address:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}