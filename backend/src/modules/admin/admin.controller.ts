import { Request, Response } from 'express';
import * as adminService from './admin.service';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json(stats);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const result = await adminService.getAllUsers(
      Number(page) || 1,
      Number(limit) || 10
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProviders = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const result = await adminService.getAllProviders(
      Number(page) || 1,
      Number(limit) || 10
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyProvider = async (req: Request, res: Response) => {
  try {
    const provider = await adminService.verifyProvider(req.params['id'] as string);
    res.status(200).json(provider);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    await adminService.banUser(req.params['id'] as string);
    res.status(200).json({ message: 'User banned successfully' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const result = await adminService.getAllBookingsAdmin(
      Number(page) || 1,
      Number(limit) || 10
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};