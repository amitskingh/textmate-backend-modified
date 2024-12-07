import express from "express"
const app = express()
import connectDB from "./config/db.js"
import "express-async-errors"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import xss from "xss-clean"

import errorHandlerMiddleware from "./middleware/errorHandler.js"
import notFoundMiddleware from "./middleware/notFound.js"

// routes
import libraryRouter from "./route/book.js"
import noteRouter from "./route/note.js"
import authRouter from "./route/auth.js"
import authenticateUser from "./middleware/authentication.js"

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`, // Frontend's URL
  credentials: true,
}

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://textmate-frontend.netlify.app",
// ]

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
// }

app.use(cors(corsOptions))
app.use(helmet())
app.use(xss())
app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/profile", authenticateUser, authRouter)
app.use("/api/v1/books", authenticateUser, libraryRouter)
app.use("/api/v1/books", authenticateUser, noteRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    console.error("Server error:", error.message)
    process.exit(1) // Exit the process with an error code
  }
}

start()
