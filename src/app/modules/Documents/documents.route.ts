
import express, { NextFunction, Request, Response } from "express";
import { DocumentController } from "./Documents.contllors";
import auth from "../../middlewares/auth";
import { use } from "passport";
import { UserRole } from "@prisma/client";
import AppError from "../../errors/AppError";
import status from "http-status";
import { pdfUpload } from "../../config/multer-config";
const router = express.Router();

router.post("/",
    auth( UserRole.SUPER_ADMIN, UserRole.ADMIN),

    pdfUpload.single('file'), DocumentController.createDocument);
router.get("/", DocumentController.getAllDocuments);
router.get("/:id", DocumentController.getSingleDocument);
router.put("/:id", pdfUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch {
      next(new AppError(status.BAD_REQUEST, "Invalid JSON in 'data' field"));
    }
  }, auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), DocumentController.updateDocument);
router.delete("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), DocumentController.deleteDocument);

export const DocumentRoutes = router;
