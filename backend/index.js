import express from "express"
import dotenv from "dotenv"
import connectDb from "./database/db.js"
import cloudinary from "cloudinary"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config({path: "../.env"})

cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_key: process.env.Cloudinary_Api,
  api_secret: process.env.Cloudinary_Secret,
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5500",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "https://mern-social-app-1-l6p9.onrender.com",
    ],
    credentials: true,
  })
)

const port = process.env.PORT || 2000

app.get("/", (req, res) => {
  res.send("hiiiiiiiiiiiiiiiiiiiiiii")
})

import registerRouter from "./router/authRouter.js"
import userRouter from "./router/userRouter.js"
import postRouter from "./router/postRoutes.js"
import messageRouter from "./router/messagesRouter.js"
import notificationRouter from "./router/notificationRouter.js"

app.use("/api/auth", registerRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/message", messageRouter)
app.use("/api/notifications", notificationRouter)

app.listen(port, () => {
  console.log(`Server is at http://localhost:${port}`)
  connectDb()
})
