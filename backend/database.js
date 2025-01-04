import mongoose from "mongoose";
// MongoDB холболт
mongoose.connect("mongodb://localhost:27017/Tse_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB холболтын алдаа:"));
db.once("open", () => {
  console.log("MongoDB холбогдлоо!");
});

export default mongoose;
