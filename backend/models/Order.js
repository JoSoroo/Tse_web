import mongoose from "../database.js";

//Захиалга. Энэ нь захиалгын бүтээгдэхүүний нэр, тоо, үнэ, зураг болон тайлбар зэргийг хадгална.
const OrderSchema = new mongoose.Schema({
  items: [
      {
          product: { type: String, required: true }, // Бүтээгдэхүүний нэр
          quantity: { type: Number, required: true }, // Тоо
          price: { type: Number, required: true }, // Үнэ
          img: { type: String, default: '' }, // Бүтээгдэхүүний зураг
          description: { type: String, default: '' }, // Бүтээгдэхүүний тайлбар
      }
  ],
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Order", OrderSchema);