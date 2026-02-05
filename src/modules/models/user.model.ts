import { z } from "zod";

const userSchema = z.object({
    name: z.string().min(2, "Name is required (min 2 chars)"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export type User = z.infer<typeof userSchema>;

const userModel = {
    userSchema
}

export default userModel