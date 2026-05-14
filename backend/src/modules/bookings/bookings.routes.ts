import { Router } from 'express';
import * as bookingsController from './bookings.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/',                   protect, bookingsController.createBooking);
router.get('/',                    protect, bookingsController.getBookings);
router.get('/:id',                 protect, bookingsController.getBooking);
router.patch('/:id/confirm',       protect, bookingsController.confirmBooking);
router.patch('/:id/complete',      protect, bookingsController.completeBooking);
router.patch('/:id/cancel',        protect, bookingsController.cancelBooking);

export default router;