import { Prisma } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import { IExpenseFilter, IExpenseType } from "./expense.interface";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import {
  expenseSearchableFields,
  updatableExpenseFields,
} from "./expense.constant";

const create = async (payload: Prisma.ExpenseCreateInput) => {
  if (payload.type === "EXPENSE" && payload.amount > 5000) {
    payload.isLarge = true;
  } else {
    payload.isLarge = undefined;
  }
  const expense = await prisma.expense.create({
    data: payload,
  });
  if (!expense) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed to create expense history"
    );
  }
  return expense;
};

const getAll = async (
  filters: IExpenseFilter,
  options: IOptions,
  userId: number
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: expenseSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  andConditions.push({
    userId: {
      equals: userId,
    },
  });

  const whereConditions: Prisma.ExpenseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.expense.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.expense.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const summary = async (userId: number) => {
  const [incomeSum, expenseSum] = await Promise.all([
    prisma.expense.aggregate({
      where: { type: "INCOME", userId },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { type: "EXPENSE", userId },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = incomeSum._sum.amount || 0;
  const totalExpense = expenseSum._sum.amount || 0;
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    balanceStatus: totalIncome >= totalExpense ? "Positive" : "Negative",
  };
};
const deleteOne = async (id: number, userId: number) => {
  const expense = await prisma.expense.delete({
    where: { id, userId: userId },
  });
  if (!expense) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete expense");
  }
  return expense;
};
const updateOne = async (
  payload: {
    amount?: number;
    type?: IExpenseType;
    note?: string;
  },
  id: number,
  userId: number
) => {
  const data = Object.fromEntries(
    Object.entries(payload).filter(
      ([key, value]) =>
        updatableExpenseFields.includes(key) && value !== undefined
    )
  );

  if (data.type === "EXPENSE" && data.amount && Number(data.amount) > 5000) {
    (data as any).isLarge = true;
  } else {
    (data as any).isLarge = false;
  }
  const expense = await prisma.expense.update({
    where: { id, userId: userId },
    data,
  });
  if (!expense) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update expense");
  }
  return expense;
};

export const ExpenseService = {
  create,
  getAll,
  deleteOne,
  updateOne,
  summary,
};
