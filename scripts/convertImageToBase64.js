import * as FileSystem from "expo-file-system";

const convertImageToBase64 = async (imageUri) => {
  console.log("converting image to base64");

  if (!imageUri || imageUri === "") return null;
  try {
    // Read the file as base64
    const base64String = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64String;
  } catch (error) {
    console.error("Error reading image file as base64:", error);
    return null;
  }
};

export default convertImageToBase64;
