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
  // destroy old image
  // create image
  const file = data?.image;
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "testImageUpload",
  });
  // return url, id, name
  return { cloudinary_id: result.public_id ?? "", url: result.url ?? "" };
};
