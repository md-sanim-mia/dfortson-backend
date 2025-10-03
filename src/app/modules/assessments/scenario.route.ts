import express, { NextFunction, Request, Response } from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import AppError from "../../errors/AppError";
import status from "http-status";
import { ScenarioController } from "./scenario.contllors";
import { pdfUpload } from "../../config/multer-config";

const router = express.Router();

// Create Scenario
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  pdfUpload.fields([
    { name: 'scenario', maxCount: 1 },
    { name: 'speech', maxCount: 1 },
    { name: 'markingPointer', maxCount: 1 },
    { name: 'additionalDocument', maxCount: 1 }
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch {
      next(new AppError(status.BAD_REQUEST, "Invalid JSON in 'data' field"));
    }
  },
  ScenarioController.createScenario
);

// Get all Scenarios
router.get("/", auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),ScenarioController.getAllScenarios);
router.get("/for-student", auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.USER),ScenarioController.getAllScenarios);

// Get single Scenario
router.get("/:id",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.USER), ScenarioController.getSingleScenario);

// Update Scenario
router.put(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
   pdfUpload.fields([
    { name: 'scenario', maxCount: 1 },
    { name: 'speech', maxCount: 1 },
    { name: 'markingPointer', maxCount: 1 },
    { name: 'additionalDocument', maxCount: 1 }
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch {
      next(new AppError(status.BAD_REQUEST, "Invalid JSON in 'data' field"));
    }
  },
  ScenarioController.updateScenario
);

// Delete Scenario
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScenarioController.deleteScenario
);

export const ScenarioRoutes = router;
