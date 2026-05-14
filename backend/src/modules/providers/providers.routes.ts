import { Router } from 'express';
import * as providersController from './providers.controller';
import { protect, adminOnly } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register',             providersController.registerProvider);
router.post('/login',                providersController.loginProvider);
router.get('/',                      providersController.getProviders);
router.get('/:id',                   providersController.getProvider);
router.patch('/:id',                 protect, providersController.updateProvider);
router.delete('/:id',                protect, adminOnly, providersController.deleteProvider);
router.get('/:id/services',          providersController.getProviderServices);
router.post('/:id/services',         protect, providersController.addService);

export default router;