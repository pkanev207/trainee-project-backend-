import mongoose from "mongoose";
import env from "../util/validate-env";

const dbName = "library";
const CONNECTION_STRING = env.CONN + dbName;
// const CONNECTION_STRING = `mongodb://127.0.0.1:27017/${dbName}`;

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(CONNECTION_STRING);
    console.log("Database connected: " + conn.connection.host);

    mongoose.connection.on("error", (err) => {
      console.error("Database error");
      console.error(err);
    });
  } catch (err) {
    console.error("Error connecting to database");
    console.log(err);
    process.exit(1);
  }
};
