import mongoose from "../database.js";

// Бүтээгдэхүүний мэдээллийг хадгалах схем. Энэ нь бүтээгдэхүүний нэр, үнэ, болон цэсийн ID-г хадгална.
const ProductSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    price: Number,
    menuId: Number, // Холбогдох цэсийн ID
  });
  

export default mongoose.model("Product", ProductSchema);