import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const backendError = (_req: Request, res: Response) => {
 const message: string = 'Internal Server Error';
 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: message,
    status: StatusCodes.INTERNAL_SERVER_ERROR,
 });
}
export default backendError;