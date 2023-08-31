import mongoose from "mongoose";

// Major articles suggest using and extending the interface from Document mongoose
// but if you want to define custom methods or relationships you should not use them.
// e.g interface ApplicationUser extends Document

const URL_PATTERN = /^https?:\/\/.+$/i;
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      unique: true,
      minlength: [4, "Book title must be at least 4 characters long!"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      minlength: [10, "Description must be at least 10 characters long!"],
    },
    // image: { type: Object, required: false },
    imgUrl: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => URL_PATTERN.test(value),
        message: "Please add image url",
      },
    },
    cloudinaryId: { type: String, required: true },
    author: {
      type: String,
      required: true,
      minlength: [3, "Author's name must be at least 3 characters long!"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userName: {
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    uploadedByUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    // expiresAt: {
    //   type: mongoose.Schema.Types.Date,
    // },
  },
  // options argument:
  {
    timestamps: true,
  }
  // {
  //   toJSON: {
  //     transform(doc, ret, options) {
  //       ret.id = ret._id;
  //       delete ret._id;
  //     },
  //   },
  // }
);

bookSchema.index(
  { title: "text", author: "text" },
  { collation: { locale: "simple" } }
);

// export const Book = mongoose.model("Book", bookSchema);
type Book = mongoose.InferSchemaType<typeof bookSchema>;

export default mongoose.model<Book>("Book", bookSchema);
