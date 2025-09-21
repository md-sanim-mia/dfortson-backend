import { Router } from "express";
import { PlanRoutes } from "../modules/plan/plan.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.routes";
import { SubscriptionRoutes } from "../modules/subscription/subscription.route";
import { blogRouter } from "../modules/blogs/blog.route";
import { DocumentRoutes } from "../modules/Documents/documents.route";
import { ScenarioRoutes } from "../modules/assessments/scenario.route";
import { submissionsRoute } from "../modules/submissions/submissions.route";
import { humanFeedbackRoute } from "../modules/humanFeedBack/human.feed.back.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/plans",
    route: PlanRoutes,
  },
  {
    path: "/subscriptions",
    route: SubscriptionRoutes,
  },
  
  {
    path: "/blogs",
    route: blogRouter,
  },
  {
    path: "/documents",
    route: DocumentRoutes,
  },
  {
    path: "/assessments",
    route: ScenarioRoutes,
  },
  {
    path: "/submissions",
    route: submissionsRoute,
  },
  {
    path: "/human-feedback",
    route: humanFeedbackRoute,
  },
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
