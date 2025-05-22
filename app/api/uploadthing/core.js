import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  resourcePdfUploader: f({ pdf: { maxFileSize: "10MB" } }).onUploadComplete(
    async ({ file }) => {
      console.log("✅ File uploaded:", file.url);
      // Do NOT return anything
    }
  ),
};




