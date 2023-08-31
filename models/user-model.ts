import mongoose from "mongoose";
import crypto from "crypto";

// const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;
// const EMAIL_PATTERN_V2 = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

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
      // validate: {
      //   validator(value: string) {
      //     return EMAIL_PATTERN.test(value);
      //   },
      //   message: "Please enter a valid email",
      // },
      match: [
        /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/,
        "Please add a valid email",
      ],
      select: false,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password should be at least 6 chars"],
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
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    // sequenceId: {  // version
    //   type: [String],
    // },
    // lastProcessedId: { // and publisher has his own db
    //   type: [String],
    // },
  },
  {
    timestamps: true,
  }
  // {
  //   toJSON: {
  //     transform(doc, ret, options) {
  //       ret.id = ret._id;
  //       delete ret._id;
  //       delete ret.password;
  //       delete ret.__v;
  //     },
  //   },
  // }
);

userSchema.methods.getForgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  // getting a hash - make sure to get hash on the backend
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  // time of token 20 minutes
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  return forgotToken;
};

// export const User = mongoose.model("User", userSchema);
type User = mongoose.InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);
