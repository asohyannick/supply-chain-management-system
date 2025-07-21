import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from "../../../entity/userEntity/userEntity";

const loginNow = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: { email, isAdmin: true },
            attributes: ['id', 'password'] // Explicitly include password
        });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        if (!user.password) {
            console.error('Password is missing for user:', user.id);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Authentication system error",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '20m'
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '7d'
        });
        user.refreshToken = refreshToken;
        await user.save();
        // Set cookie
        res.cookie('auth', accessToken, {
            httpOnly: true,
            maxAge: 20 * 60 * 1000, // 20 minutes
            sameSite: 'strict',
            secure: process.env.NODE_ENV as string === 'production',
        });

        // Response data
        return res.status(StatusCodes.OK).json({
            success: true,
            message: " User  has login successfully!",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        // Special handling for bcrypt errors
        if (error instanceof Error && error.message.includes("Illegal arguments")) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Password comparison failed",
                error: "Authentication system error"
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Login failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export default loginNow;