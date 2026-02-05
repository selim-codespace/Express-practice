import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config";
import prisma from "../../shared/prisma";
import type { LoginUserType } from "./auth.interface";

const loginUser = async (payload: LoginUserType) => {
    // 1. Check if user exists
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (!isUserExist) {
        throw new Error("User does not exist");
    }

    // 2. Check if password is correct
    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        isUserExist.password
    );

    if (!isPasswordMatched) {
        throw new Error("Password incorrect");
    }

    // 3. Create Access Token & Refresh Token
    const accessToken = jwt.sign(
        { userId: isUserExist.id, email: isUserExist.email },
        config.jwt.secret as jwt.Secret,
        { expiresIn: config.jwt.expires_in as jwt.SignOptions['expiresIn'] }
    );

    const refreshToken = jwt.sign(
        { userId: isUserExist.id, email: isUserExist.email },
        config.jwt.refresh_secret as jwt.Secret,
        { expiresIn: config.jwt.refresh_expires_in as jwt.SignOptions['expiresIn'] }
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const AuthService = {
    loginUser,
};
