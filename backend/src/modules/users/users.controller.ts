import { Request, Response } from 'express';
import * as usersService from './users.service';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers(req.query);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await usersService.getUserById(req.params['id'] as string);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await usersService.updateUser(req.params['id'] as string, req.body);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await usersService.softDeleteUser(req.params['id'] as string);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};