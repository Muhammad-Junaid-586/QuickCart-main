import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: String,
  email: String,
  imageUrl: String,
  cartItems: {
    type: Object,
    default: {},
  },
}, { minimize: false });

// Remove cached model if it exists to avoid caching issues
// if (mongoose.models.user) {
//   delete mongoose.models.user;
// }

// const User = mongoose.model("user", userSchema);
const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
