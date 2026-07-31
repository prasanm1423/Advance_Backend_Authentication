import mongoose from "mongoose";

export async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected Successfully to Mongo DB Datbase");
  } catch (err) {
    console.log(err);
    console.error("Mongo Database Connection failed");
    process.exit(1);
  }
}
