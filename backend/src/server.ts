import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes         from './modules/auth/auth.routes';
import userRoutes         from './modules/users/users.routes';
import providerRoutes     from './modules/providers/providers.routes';
import serviceRoutes      from './modules/services/services.routes';
import bookingRoutes      from './modules/bookings/bookings.routes';
import reviewRoutes       from './modules/reviews/reviews.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import paymentRoutes      from './modules/payments/payments.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/providers',     providerRoutes);
app.use('/api/services',      serviceRoutes);
app.use('/api/bookings',      bookingRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/categories', serviceRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok', message: 'Handlit API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});