import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";

const { diskStorage } = require("multer");

const uploadRoot = join(process.cwd(), "uploads");
const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type LocalUploadedFile = {
  filename: string;
  mimetype: string;
  size: number;
  path: string;
};

const ensureUploadDir = (folder: string) => {
  const destination = join(uploadRoot, folder);

  if (!existsSync(destination)) {
    mkdirSync(destination, { recursive: true });
  }

  return destination;
};

export const createImageUploadOptions = (folder: "profiles" | "listings") => ({
  storage: diskStorage({
    destination: (
      _req: unknown,
      _file: unknown,
      callback: (error: Error | null, destination: string) => void,
    ) => {
      callback(null, ensureUploadDir(folder));
    },
    filename: (
      _req: unknown,
      file: { originalname: string },
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const extension = extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    },
  }),
  fileFilter: (
    _req: unknown,
    file: { mimetype: string },
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      callback(
        new BadRequestException("Envie uma imagem JPG, PNG, WEBP ou GIF"),
        false,
      );
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const buildUploadedFileUrl = (
  request: { protocol: string; get(name: string): string | undefined },
  folder: "profiles" | "listings",
  file?: LocalUploadedFile,
) => {
  if (!file) {
    throw new BadRequestException("Envie uma imagem no campo image");
  }

  const host = request.get("host");
  const baseUrl = host ? `${request.protocol}://${host}` : "";

  return `${baseUrl}/uploads/${folder}/${file.filename}`;
};
