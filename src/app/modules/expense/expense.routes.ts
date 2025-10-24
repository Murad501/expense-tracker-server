import express from "express";
import { ExpenseController } from "./expense.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(), ExpenseController.create);
router.get("/", auth(), ExpenseController.getAll);
router.get("/summary", auth(), ExpenseController.summary);
router.patch("/:id", auth(), ExpenseController.updateOne);
router.delete("/:id", auth(), ExpenseController.deleteOne);

export const expenseRoutes = router;
