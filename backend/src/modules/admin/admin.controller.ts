import { Request, Response } from "express";
import * as adminService from "./admin.service";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await adminService.loginAdmin(email, password);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({
      message: err.message || "Login failed",
    });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();

    res.status(200).json(stats);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllUsers();

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getProviders = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllProviders();

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const verifyProvider = async (req: Request, res: Response) => {
  try {
    const result = await adminService.verifyProvider(
      req.params["id"] as string,
    );

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    await adminService.banUser(req.params["id"] as string);

    res.status(200).json({
      message: "User banned",
    });
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllBookingsAdmin();

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};
