import { Router } from 'express';
import * as usersController from './users.controller';
import { protect, adminOnly } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/',      protect, adminOnly, usersController.getUsers);
router.get('/:id',   protect, usersController.getUser);
router.patch('/:id', protect, usersController.updateUser);
router.delete('/:id',protect, adminOnly, usersController.deleteUser);

export default router;