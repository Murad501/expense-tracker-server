import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { expenseFilterableFields } from "./expense.constant";
import { ExpenseService } from "./expense.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../helper/pick";
import { IJWTPayload } from "../../types/common";
import { UserService } from "../user/user.service";
import ApiError from "../../errors/ApiError";

const create = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const userData = req.user;
    const user = await UserService.getByEmail(userData?.email || "");

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized User");
    }

    const result = await ExpenseService.create({
      ...req.body,
      userId: user.id,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Expense history created successfully",
      data: result,
    });
  }
);
const getAll = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const userData = req.user;
    const user = await UserService.getByEmail(userData?.email || "");

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized User");
    }

    const filters = pick(req.query, expenseFilterableFields);
    
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await ExpenseService.getAll(filters, options, user.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Expense retrieval successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const ExpenseController = {
  getAll,
  create,
};
