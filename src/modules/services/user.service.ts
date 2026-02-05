import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { User } from "../models/user.model";

const createUser = async (userData: User) => {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // 3. Create the user in database
    const user = await prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    });

    return user;
};

const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true
        }
    });
};

export const UserService = {
    createUser,
    getAllUsers
};
