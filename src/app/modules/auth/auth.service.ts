import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import { LoginPayload } from "./auth.interface";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helper/jwtHelper";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { Prisma, User } from "@prisma/client";

const login = async (payload: LoginPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};
const register = async (payload: Prisma.UserCreateInput) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashPassword,
      role: "USER",
    },
  });

  if(!user){
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  const { password, ...userWithoutPassword } = user;

  return {
    data: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  login,
  register,
};
