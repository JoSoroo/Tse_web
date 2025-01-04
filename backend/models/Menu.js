import mongoose from "../database.js";

// Цэсийн мэдээллийг хадгалах схем
const MenuSchema = new mongoose.Schema({
    _id: Number, // Цэсийн ID
    title: String, // Цэсийн гарчиг
  });

export default mongoose.model("Menu", MenuSchema, "menu");