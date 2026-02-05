import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string().min(1, "Refresh token is required"),
    }),
});

export const AuthValidation = {
    loginValidationSchema,
    refreshTokenValidationSchema,
};
