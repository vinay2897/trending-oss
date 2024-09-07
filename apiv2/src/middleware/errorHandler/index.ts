import { NextFunction, Request, Response } from 'express';

const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(500).json({
    name: err.name,
    message: err.message,
  });
};

export default errorHandler;

