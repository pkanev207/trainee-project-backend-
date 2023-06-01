import * as dotenv from "dotenv";
import cloudinaryModule from "cloudinary";

dotenv.config();

const cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

interface ICloudinaryParams {
  cloudinary_id: string;
  url: string;
}

export const uploadToCloudinary = async (
  data: any
): Promise<ICloudinaryParams> => {
  // create image
  const file = data?.image;
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "testImageUpload",
    width: 150,
    crop: "scale",
  });
  // return url, id, name
  return { cloudinary_id: result.public_id ?? "", url: result.url ?? "" };
};

export const deleteFromCloudinary = async (id: string): Promise<string> => {
  return await cloudinary.uploader.destroy(id);
};
