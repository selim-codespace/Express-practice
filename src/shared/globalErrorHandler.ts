import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message = err.message || "Something went wrong!";
    let errorSources: any[] = [];

    if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
        
        // Handle missing request body
        if (err.issues.some(issue => issue.code === "invalid_type" && issue.received === "undefined" && issue.path.length === 0)) {
            message = "Request body is missing or empty";
            errorSources = [{
                path: "request.body",
                message: "Please provide the required user information"
            }];
        } else {
            // Handle specific field validation errors
            message = "Please correct the following validation errors:";
            errorSources = err.issues.map((issue) => {
                const field = issue.path.join('.') || 'field';
                let userMessage = "";
                
                // Create user-friendly messages based on validation type
                if (issue.code === "invalid_type") {
                    if (issue.received === "undefined") {
                        userMessage = `${field} is required`;
                    } else {
                        userMessage = `${field} must be of type ${issue.expected}`;
                    }
                } else if (issue.code === "too_small") {
                    userMessage = `${field} must be at least ${issue.minimum} characters long`;
                } else if (issue.code === "invalid_string" && issue.validation === "email") {
                    userMessage = `${field} must be a valid email address`;
                } else {
                    userMessage = issue.message;
                }
                
                return {
                    path: field,
                    message: userMessage
                };
            });
        }
    } else if (err.message.includes("exists")) {
        statusCode = httpStatus.CONFLICT;
        message = err.message;
    } else if (err.message.includes("not found")) {
        statusCode = httpStatus.NOT_FOUND;
        message = err.message;
    }

    // Remove stack trace in production
    const stack = process.env.NODE_ENV === "development" ? err?.stack : undefined;

    return res.status(statusCode).json({
        success: false,
        message,
        errorSources: errorSources.length > 0 ? errorSources : undefined,
        ...(stack && { stack }) // Only include stack in development
    });
};

export default globalErrorHandler;
