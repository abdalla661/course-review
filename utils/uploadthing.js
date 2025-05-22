import { generateReactHelpers } from "@uploadthing/react";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const { uploadFiles } = generateReactHelpers(ourFileRouter);
