import { UserRole } from "@prisma/client";
import { UploadController } from "./uploads.contllors";
import auth from "../../middlewares/auth";
import express, { NextFunction, Request, Response } from 'express'
import { multerUpload } from "../../config/multer-config";
const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  multerUpload.single("file"),
  // (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     req.body = JSON.parse(req.body.data);

  //     console.log(req.body)
  //     next();
  //   } catch (err) {
  //     next(err); // error middleware এ পাঠাবে
  //   }
  // },
  UploadController.createUpload
);
router.post(
  "/multiple-images",
  auth(UserRole.ADMIN ,UserRole.SUPER_ADMIN),
   multerUpload.fields([{ name: "images" }]),
  // (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     req.body = JSON.parse(req.body.data);

  //     console.log(req.body)
  //     next();
  //   } catch (err) {
  //     next(err); // error middleware এ পাঠাবে
  //   }
  // },
  UploadController.createUploadsIntoDB
);

router.get(
  "/",
  auth( UserRole.SUPER_ADMIN),
  UploadController.getAllUploads
);
router.delete(
  "/delete-multiple/images",
 
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UploadController.deleteMultipleFiles
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
   multerUpload.single("file"),
  UploadController.updateUpload
);

router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.SUPER_ADMIN),
  UploadController.deleteUpload
);


export const uploadRoute= router;