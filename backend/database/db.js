import mongoose from "mongoose"

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {dbName: "again_practice"})
    console.log("DB_ CONNECTED")
  } catch (error) {
    error.message
    console.log(`DB CONNECTION`)
  }
}

export default connectDb
