import { Router } from "express";
import { PlanRoutes } from "../modules/plan/plan.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.routes";
import { SubscriptionRoutes } from "../modules/subscription/subscription.route";
import { uploadRoute } from "../modules/uploads/upload.route";
import { blogRouter } from "../modules/blogs/blog.route";

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
    path: "/uploads",
    route: uploadRoute,
  },
  {
    path: "/blogs",
    route: blogRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
