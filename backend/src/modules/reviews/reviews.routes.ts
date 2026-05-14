import { Router } from 'express';
import * as reviewsController from './reviews.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/',                          protect, reviewsController.createReview);
router.get('/provider/:providerId',       reviewsController.getProviderReviews);
router.delete('/:id',                     protect, reviewsController.deleteReview);

export default router;