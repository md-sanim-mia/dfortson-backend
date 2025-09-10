import { UserRole } from "@prisma/client";
import { UploadController } from "./uploads.contllors";
import auth from "../../middlewares/auth";
import express from 'express'
const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  UploadController.createUpload
);

router.get(
  "/",
  auth( UserRole.SUPER_ADMIN),
  UploadController.getAllUploads
);
router.get(
  "/my-uploads",
  auth( UserRole.SUPER_ADMIN,UserRole.USER),
  UploadController.getAllMyUploads
);

router.get(
  "/:id",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  UploadController.getSingleUpload
);

router.patch(
  "/:id",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  UploadController.updateUpload
);

router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  UploadController.deleteUpload
);

export const uploadRoute= router;