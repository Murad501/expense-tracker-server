import express from "express";
import { ExpenseController } from "./expense.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(), ExpenseController.create);
router.get("/", auth(), ExpenseController.getAll);
router.get("/summary", auth(), ExpenseController.summary);

export const expenseRoutes = router;
