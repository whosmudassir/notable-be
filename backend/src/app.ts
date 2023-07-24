import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import notesRoute from "./routes/notes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import usersRoute from "./routes/users";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";
import cors from "cors";

const app = express();

//HTTP request logger middleware for node.js
//print this in console : GET /api/notes/644918460cf62902a184ec8 500 40.650 ms - 122
app.use(morgan("dev"));

//to set data format
app.use(express.json());

app.use(
  cors({
    origin: "https://notable-fe.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With", // For AJAX requests
      "Accept", // For specifying the response format (e.g., JSON)
    ],
  })
);

//set up express session, cookie setup, store in mongo
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      sameSite: "none", // Set the SameSite attribute (lax or strict based on your requirements)
      secure: true, // Set to true to send the cookie only over HTTPS in production
      httpOnly: false, // Set to false to allow client-side JavaScript to access the cookie
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

//first endpoint
app.use("/api/users", usersRoute);
app.use("/api/notes", requiresAuth, notesRoute);

//error handling in case of path that is not present
app.use((req, res, next) => {
  //from http-error package which is used to create errors
  next(createHttpError(404, "Endpoint not found"));
});

//usually used to handle error cases in catch block
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  //setting up error using http-errors
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  res.status(statusCode).json({ error: errorMessage });
});

export default app;
