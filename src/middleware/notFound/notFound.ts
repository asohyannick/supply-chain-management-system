import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const notFound = (_req: Request, res: Response) => {
 const message: string = 'Route doesn\'t exist!';
 return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: message,
    status: StatusCodes.NOT_FOUND,
 });
}
export default notFound;