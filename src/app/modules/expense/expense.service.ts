import { Prisma } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import { IExpenseFilter } from "./expense.interface";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { expenseSearchableFields } from "./expense.constant";

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

export const ExpenseService = {
  create,
  getAll,
};
