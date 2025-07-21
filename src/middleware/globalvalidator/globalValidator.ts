import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AnySchema } from "yup";
const globalValidator = (schema: AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body, {abortEarly: false});
            next(); 
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({errors: error})
        }
    }
}

export default globalValidator;