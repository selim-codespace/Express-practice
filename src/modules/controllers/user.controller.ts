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
    
    if (req.body) {
        console.log("Raw body keys:", Object.keys(req.body));
        console.log("Request body:", JSON.stringify(req.body, null, 2));
    } else {
        console.log("❌ Request body is undefined/null");
    }
   

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
const updateUser = catchAsync(async (req: Request, res: Response) => { 
    const { id } = req.params;
    
    // Ensure id is a string (handle potential string[] case)
    const userId = Array.isArray(id) ? id[0] : id;
    
    if(!userId) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "User id not given" }); 
    const result = await UserService.updateUser(userId, req.body);
        
    res.status(httpStatus.OK).json({
        success: true,
        message: "User updated successfully",
        data: result
    });
    
});

// delete user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;
    console.log("Deleting user with id:", userId);
    try {
       const result = await UserService.deleteUser(userId);
        res.status(httpStatus.OK).json({
            success: true,
            message: "User deleted successfully",
            data: result
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
})

export default {
    userInfo,
    createUser,
    updateUser,
    deleteUser
}