import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from "../../../entity/userEntity/userEntity";
const createAccount = async(req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const user =  await User.findOne({where: { email }});
        if (user) {
            user.refreshToken = '';
            await user.save();
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "User already exist!",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            isAdmin: true,
        });
        await newUser.save();
        const accessToken = jwt.sign({id: newUser.id, firstName: newUser.firstName, lastName:newUser.lastName, email:newUser.email, password: newUser.password, isAdmin:newUser.isAdmin}, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '20m',
        })
        const refreshToken = jwt.sign({id: newUser.id, firstName: newUser.firstName, lastName:newUser.lastName, email:newUser.email, password: newUser.password, isAdmin:newUser.isAdmin}, process.env.JWT_SECRET_KEY as string, {
            expiresIn: '7d',
        });
        newUser.refreshToken = refreshToken;
        await newUser.save();
        res.cookie('auth', accessToken, {
            httpOnly: true,
            maxAge: 90000,
            sameSite: 'strict',
            secure: process.env.NODE_ENV as string === 'production',
        });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User registration is successful!",
            accessToken,
            refreshToken,
            newUser
        });
    } catch (error) {
        console.error("Error occured!", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Something went wrong!",
            error: error instanceof Error ? error.message : "Unknown Error Message",
        });
    }
}

export default createAccount;