import fs from "fs/promises";

//create date modifier
export const modifyDate = (date: string) => (date.includes("Z") ? date : date + "Z");

export const deleteTempFiles = async (filePath: string) => {
  try {
    //deleting file content
    const fileContent = await fs.unlink(filePath);

    console.log("successfully deleted" + filePath);
  } catch (err) {
    console.log("Error deleting file", err);
  }
};
