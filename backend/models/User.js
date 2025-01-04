import mongoose from "../database.js";

// Хэрэглэгчийн имэйл болон нууц үгийг хадгалах схем. Имэйл нь цор ганц байх ёстой.
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Имэйл хаяг заавал байх шаардлагатай, дахин давтагдахгүй
    password: { type: String, required: true }, // Нууц үг заавал байх шаардлагатай
  });
  

export default mongoose.model("User", UserSchema);
