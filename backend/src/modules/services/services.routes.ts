import { Router } from 'express';
import * as servicesController from './services.controller';
import { protect, adminOnly } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/',           servicesController.getServices);
router.get('/:id',        servicesController.getService);
router.post('/',          protect, adminOnly, servicesController.createService);
router.patch('/:id',      protect, adminOnly, servicesController.updateService);
router.delete('/:id',     protect, adminOnly, servicesController.deleteService);
router.get('/categories',  servicesController.getCategories);
router.post('/categories', protect, adminOnly, servicesController.createCategory);

export default router;