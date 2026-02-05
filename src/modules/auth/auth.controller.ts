import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);

    const { refreshToken, accessToken } = result;

    // Set refresh token into cookie
    res.cookie("refreshToken", refreshToken, {
        secure: config.env === "production",
        httpOnly: true,
    });

    res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: {
            accessToken,
        },
    });
});

export const AuthController = {
    loginUser,
};
