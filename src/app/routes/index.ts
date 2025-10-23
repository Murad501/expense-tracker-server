import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { expenseRoutes } from "../modules/expense/expense.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/expenses",
    route: expenseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
