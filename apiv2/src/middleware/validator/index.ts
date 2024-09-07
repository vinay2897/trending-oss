import * as yup from 'yup';
import { NextFunction, Request, Response } from 'express';

export default function(schema: yup.Schema, source: 'body' | 'params' | 'query') {
    const validator = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req[source] = await schema.validate(req[source]);
            next();
        } catch(err) {
            if (err instanceof yup.ValidationError) {
                return res.status(400).json({
                    errors: err.errors
                })
            }
            next(err)
        }
    }

    return validator;
}