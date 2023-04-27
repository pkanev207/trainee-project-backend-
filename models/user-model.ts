import mongoose from "mongoose";

const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      validate: {
        validator(value: string) {
          return EMAIL_PATTERN.test(value);
        },
        message: "Please enter a valid email",
      },
      select: false,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    finishedBooks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Book",
      default: [],
    },
    currentBooks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Book",
      default: [],
    },
    futureBooks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Book",
      default: [],
    },
    likedBooks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Book",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// export const User = mongoose.model("User", userSchema);
type User = mongoose.InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);
