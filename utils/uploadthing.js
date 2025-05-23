import { generateReactHelpers } from "@uploadthing/react";
import { ourFileRouter } from "@/uploadthing/core";

export const { uploadFiles } = generateReactHelpers(ourFileRouter);
