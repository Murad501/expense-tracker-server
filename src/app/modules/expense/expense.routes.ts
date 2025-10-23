import express from "express";
import { ExpenseController } from "./expense.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(), ExpenseController.create);
router.get("/", auth(), ExpenseController.getAll);

export const expenseRoutes = router;
