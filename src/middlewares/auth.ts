import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                throw new Error("You are not authorized!");
            }

            let verifiedToken = null;
            try {
                verifiedToken = jwt.verify(
                    token,
                    config.jwt.secret as string
                ) as JwtPayload;
            } catch (error) {
                throw new Error("Invalid token");
            }

            req.user = verifiedToken;

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default auth;
