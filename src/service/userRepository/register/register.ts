import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from "../../../entity/userEntity/userEntity";

const createAccount = async(req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, password } = req.body;
    try {
        if (firstName.length > 100) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "First name cannot exceed 100 characters",
            });
        }
        if (lastName.length > 100) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Last name cannot exceed 100 characters",
            });
        }
        if (email.length > 255) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Email cannot exceed 255 characters",
            });
        }
        const user = await User.findOne({where: { email }});
        if (user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "User already exists!",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isAdmin: true,
        });
        const payload = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        };
        const accessToken = jwt.sign(
            payload, 
            process.env.JWT_SECRET_KEY as string, 
            { expiresIn: '20m' }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '7d' }
        );
        // Update refresh token
        await newUser.update({ refreshToken });
        res.cookie('auth', accessToken, {
            httpOnly: true,
            maxAge: 20 * 60 * 1000, // 20 minutes
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        // Create safe user response without sensitive data
        const safeUser = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        };
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User registration successful!",
            accessToken,
            refreshToken,
            user: safeUser
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Registration failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export default createAccount;