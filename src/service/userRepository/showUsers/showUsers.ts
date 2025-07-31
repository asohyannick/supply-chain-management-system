import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../../../entity/userEntity/userEntity";
const showUsers = async(_req: Request, res: Response): Promise<Response> => {
    try {
        const users = await User.findAll({});
        if (!users || users.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No users found"
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Users have been fetched successfully!",
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

export default showUsers;