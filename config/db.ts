// Atlas username: pkanev
// Atlas password: traineeproject123
// Atlas Compass: mongodb+srv://pkanev:traineeproject123@cluster0.amjepi9.mongodb.net/library
// Atlas app: mongodb+srv://pkanev:traineeproject123@cluster0.amjepi9.mongodb.net/library?retryWrites=true&w=majority
// Atlas Compass: mongodb+srv://pkanev:traineeproject123@books.himsp1y.mongodb.net

import mongoose from "mongoose";
const dbName = "library";
const CONNECTION_STRING = `mongodb://127.0.0.1:27017/${dbName}`;

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
