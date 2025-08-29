import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/config/db";
import Product from "../../../../modals/Product";
import { NextResponse } from "next/server";
// import { authSeller } from "@/lib/authSeller";
// import {authSeller} from '../../../../lib/authSeller';
import authSeller from "@/lib/authSeller";

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
      const {userId} = getAuth(request);

  const isSeller = await authSeller(userId);

  if (!isSeller) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

 
  const name = formData.get("name");
  const description = formData.get("description");
  const category = formData.get("category");
  const price = formData.get("price");
  const offerPrice  = formData.get("offerPrice");
  const files = formData.getAll("files");

  if (!files || files.length === 0) {
    console.log("No files uploaded");
    
    return NextResponse.json({ success: false, message: "No files uploaded" }, { status: 400 });
  }

  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
     
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({resource_type : 'auto'},(error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
            
          }
        })
        stream.end(buffer);
      })
    })
  );

  const imageUrls = uploadedImages.map((result) => result.secure_url);
  await connectDB();
  const newProduct = await Product.create({
    name,
    description,
    category,
    price : Number(price),
    offerPrice : Number(offerPrice),
    image: imageUrls,
    date : Date.now(),
  })
  console.log('product added successfully');
  
    return NextResponse.json({ success: true, message: "Product added successfully" , newProduct }, { status: 200 });
 
    
  } catch (error) {
    console.error("Error in /api/product/add:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
 }

