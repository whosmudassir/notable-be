import mongoose from "mongoose";

declare module "express-session" {
  interface SessionData {
    userId: moongose.Types.ObjectId;
  }
}
