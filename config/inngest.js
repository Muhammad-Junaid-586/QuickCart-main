import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/modals/User"; // ✅ Import your Mongoose model
import Order from "@/modals/Order";

export const inngest = new Inngest({ id: "quickcart-next" });

export const sycnUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      throw new Error("Missing email address in Clerk user creation event");
    }

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email,
      imageUrl: image_url,
    };

    console.log("Received Clerk User:", event.data);

    await connectDB();
    // await User.create(userData);
    try {
  await User.create(userData);
  console.log("User saved to DB:", userData);
} catch (err) {
  console.error("Error saving user to MongoDB:", err);
}

    
  }
);

export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      throw new Error("Missing email address in Clerk user update event");
    }

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);


export const createUserOrder = inngest.createFunction(
  { id: "create-user-order" , batchEvents : {
    maxSize : 25,
    timeout : '5s'
  } },
  { event: "order/created" },
  async ({ events }) => {
    const orders = events.map((event) => {
      return {
        userId: event.data.user_id,
        items : event.data.items,
        amount : event.data.amount,
        address : event.data.address,
        date : event.data.date
      };
    });

    await connectDB();
    await Order.create(orders);
    return { success: true, message: "Orders created successfully" ,processed : orders.length };
  }
)