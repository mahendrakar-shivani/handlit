import { Router } from 'express';
import * as paymentsController from './payments.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/create-order',          protect, paymentsController.createOrder);
router.post('/verify',                protect, paymentsController.verifyPayment);
router.get('/booking/:bookingId',     protect, paymentsController.getPaymentByBooking);

export default router;