import mongoose from "mongoose";

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
    imgUrl: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => URL_PATTERN.test(value),
        message: "Please add image url",
      },
    },
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
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model("Book", bookSchema);
