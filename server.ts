import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import userRouter from "./src/modules/routes/user.route";
import globalErrorHandler from "./src/shared/globalErrorHandler";
import { AuthRoutes } from "./src/modules/auth/auth.route";
import prisma from "./src/shared/prisma";

const app: Express = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Enhanced JSON parsing middleware
app.use(express.json({ 
    limit: '10mb',
    type: 'application/json'
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Optional: Add multipart/form-data support (uncomment if needed)
// import multer from 'multer';
// const upload = multer();
// app.use(upload.none()); // For parsing multipart/form-data without files
app.use(cookieParser());

// Debug middleware to log request details
// app.use((req, res, next) => {
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//     console.log('Content-Type:', req.get('Content-Type'));
//     console.log('Request body size:', req.body ? JSON.stringify(req.body).length : 0);
//     next();
// });

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Application Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", AuthRoutes);

// Global Error Handler
app.use(globalErrorHandler);

// Not Found Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found",
    });
});

// Test database connection before starting server
async function startServer() {
    try {
        // Connect to database and test the connection
        await prisma.$connect();
        console.log("✅ Database connected successfully!");
        
        // Start the server
        app.listen(3000, () => {
            console.log("✅ Server is running on port 3000"); 
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit the process if database connection fails
    }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('\n shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
