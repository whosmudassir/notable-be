import app from "./app";
import mongoose from "mongoose";
import env from "./util/validateEnv";

const port = env.PORT || 8000;

//mongo db connection + running server on port
mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("mongo connected");
    //starts a server
    app.listen(port, () => {
      console.log("Server running on port : " + port);
    });
  })
  .catch((err) => console.log(err));

// secure password
// Mz8DFu3iMgOKTZsk
