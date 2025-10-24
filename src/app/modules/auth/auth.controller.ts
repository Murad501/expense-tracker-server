import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";
import { IJWTPayload } from "../../types/common";
import { UserService } from "../user/user.service";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User logged in successfully!",
    data: {
      accessToken,
    },
  });
});
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  const { accessToken, refreshToken, data } = result;

  res.cookie("accessToken", accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });
  res.cookie("refreshToken", refreshToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 90,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created in successfully!",
    data: {
      data,
      accessToken,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;

  res.clearCookie("accessToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.clearCookie("refreshToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User logged out successfully!",
    data: {
      accessToken,
    },
  });
});

const me = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const userData = req.user;
    const user = await UserService.getByEmail(userData?.email || "");

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized User");
    }

    const { password, ...rest } = user;

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile retrieval successfully",
      data: rest,
    });
  }
);

export const AuthController = {
  login,
  register,
  logout,
  me,
};
