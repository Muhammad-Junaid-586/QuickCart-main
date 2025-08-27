import { Inngest } from "inngest";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// inngest function to save user data to database

export const sycnUserCreation = inngest.createFunction(
  {
  id: "sync-user-from-clerk",
},
{
  event : 'clerk/user.created',
  
},
async ({event}) => {
  const {id , first_name , last_name , emailAddresses , image_url} = event.data;
  const userData = {
    _id : id,
    name : `${first_name} ${last_name}`,
    email : emailAddresses[0].emailAddress,
    imageUrl : image_url
  }
  await connectDB();
  await User.create(userData)
}
)

export const syncUserUpdation = inngest.createFunction(
  {
    id : 'update-user-from-clerk'
  },
  {
    event : 'clerk/user.updated'
  },
  async ({event}) => {
    const {id , first_name , last_name , emailAddresses , image_url} = event.data;
    const userData = {
      _id : id,
      name : `${first_name} ${last_name}`,
      email : emailAddresses[0].emailAddress,
      imageUrl : image_url
    }
    await connectDB();
    await User.findByAndUpdate(id , userData)
  }
)

export const syncUserDeletion = inngest.createFunction(
  {
    id : 'delete-user-with-clerk'
  },
  {
    event : 'clerk/user.deleted'
  },
  async ({event}) => {
    const {id} = event.data;
    await connectDB();
    await User.findByAndDelete(id)
  }
)