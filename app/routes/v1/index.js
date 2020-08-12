import { Router } from 'express';
import taskRoutes from './task';
import userRoutes from './users';

const router = Router();

router.use('/auth', userRoutes);
router.use('/', taskRoutes);

export default router;
