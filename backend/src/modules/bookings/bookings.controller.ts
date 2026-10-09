import { Request, Response } from 'express';
import * as bookingsService from './bookings.service';

export const createBooking = async (req: any, res: Response) => {
  try {
    const data = { ...req.body, userId: req.user.id };
    const booking = await bookingsService.createBooking(data);
    res.status(201).json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getBookings = async (req: any, res: Response) => {
  try {
    const result = await bookingsService.getAllBookings(req.query, req.user);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingsService.getBookingById(req.params['id'] as string);
    res.status(200).json(booking);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const confirmBooking = async (req: any, res: Response) => {
  try {
    const booking = await bookingsService.updateBookingStatus(
      req.params['id'] as string,
      'CONFIRMED',
      req.user.id
    );
    res.status(200).json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const completeBooking = async (req: any, res: Response) => {
  try {
    const booking = await bookingsService.updateBookingStatus(
      req.params['id'] as string,
      'COMPLETED',
      req.user.id
    );
    res.status(200).json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const cancelBooking = async (req: any, res: Response) => {
  try {
    const booking = await bookingsService.cancelBooking(
      req.params['id'] as string,
      req.user.id
    );
    res.status(200).json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const inProgressBooking = async (req: any, res: Response) => {
  try {
    const booking = await bookingsService.updateBookingStatus(req.params['id'], 'IN_PROGRESS', req.user.id);
    res.status(200).json(booking);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};