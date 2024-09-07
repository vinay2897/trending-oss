import { Router } from 'express';
import reposRouter from './repository';

const router = Router();

router.post('/', reposRouter);

export default router;

