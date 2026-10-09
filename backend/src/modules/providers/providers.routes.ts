import { Router } from 'express';
import * as providersController from './providers.controller';
import { protect, adminOnly } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post(
  '/register',
  providersController.registerProvider
);

router.post(
  '/login',
  providersController.loginProvider
);

router.get(
  '/',
  providersController.getProviders
);

router.get(
  '/:id',
  providersController.getProvider
);

router.get(
  '/:id/services',
  providersController.getProviderServices
);


// Protected routes
router.patch(
  '/:id',
  protect,
  providersController.updateProvider
);

router.post(
  '/:id/services',
  protect,
  providersController.addService
);


// Admin only
router.delete(
  '/:id',
  protect,
  adminOnly,
  providersController.deleteProvider
);

export default router;