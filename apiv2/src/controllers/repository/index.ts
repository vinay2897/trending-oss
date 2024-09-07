import { Request, Response, NextFunction } from 'express';
import * as reposService from '../../services/repository';
import dbClient from '../../db';
import { GetRepos } from '../../validators/repository';

export const getRepos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repos = await reposService.getRepos(dbClient, req.body as GetRepos);
    res.json(repos);
  } catch (error) {
    next(error);
  }
};

