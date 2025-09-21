import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { humanFeedbackControllers } from "./human.feed.back.contllors";

const route = express.Router();

// Create human feedback
route.post(
  "/:submissionId",
  auth(UserRole.SUPER_ADMIN, UserRole.USER), // যারা feedback দিতে পারবে
  humanFeedbackControllers.createHumanFeedback
);

// Get all human feedbacks
route.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  humanFeedbackControllers.getAllHumanFeedbacks
);

// Get single human feedback by id
route.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  humanFeedbackControllers.getSingleHumanFeedback
);

// Update human feedback
route.put(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.USER),
  humanFeedbackControllers.updateHumanFeedback
);

// Delete human feedback
route.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  humanFeedbackControllers.deleteHumanFeedback
);

export const humanFeedbackRoute = route;
