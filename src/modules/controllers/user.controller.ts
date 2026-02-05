import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import userModel from "../models/user.model";
import { UserService } from "../services/user.service";

// get user info
const userInfo = catchAsync(async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    
    if (!users || users.length === 0) {
        return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "No users found",
        });
    }
    
    res.status(httpStatus.OK).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
    });
});


// create user 
const createUser = catchAsync(async (req: Request, res: Response) => {
    // Debug logging - safe handling of undefined body
    console.log("=== CREATE USER DEBUG INFO ===");
    console.log("Request headers:", req.headers);
    console.log("Content-Type:", req.get('Content-Type'));
    console.log("Body exists:", !!req.body);
    console.log("Body type:", typeof req.body);
    
    if (req.body) {
        console.log("Raw body keys:", Object.keys(req.body));
        console.log("Request body:", JSON.stringify(req.body, null, 2));
    } else {
        console.log("❌ Request body is undefined/null");
    }
    console.log("============================");

    // 1. Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
        console.log("❌ Empty request body detected");
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Request body is missing or empty",
            errorSources: [{
                path: "request.body",
                message: "Please provide user information including name, email, and password"
            }]
        });
    }

    console.log("✅ Request body found, proceeding with validation");

    // 2. Validate the request body
    const validatedData = userModel.userSchema.parse(req.body);

    // 3. Call service to create user
    const result = await UserService.createUser(validatedData);

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "User created successfully",
        data: result
    });
});



// update user
const updateUser = async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            message: "User updated",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

// delete user
const deleteUser = async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            message: "User deleted",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export default {
    userInfo,
    createUser,
    updateUser,
    deleteUser
}