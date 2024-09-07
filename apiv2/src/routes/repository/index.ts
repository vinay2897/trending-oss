import { Router } from 'express';
import * as reposeController from '../../controllers/repository';
import validator from '../../middleware/validator';
import { getReposSchema } from '../../validators/repository';

const router = Router();

router.post('/', validator(getReposSchema, 'body'), reposeController.getRepos);

export default router;

