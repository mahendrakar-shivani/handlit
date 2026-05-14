import { Request, Response } from 'express';
import * as providersService from './providers.service';

export const registerProvider = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email and password are required' });
      return;
    }
    const result = await providersService.registerProvider(name, email, password, phone);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const loginProvider = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    const result = await providersService.loginProvider(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const getProviders = async (req: Request, res: Response) => {
  try {
    const result = await providersService.getAllProviders(req.query);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProvider = async (req: Request, res: Response) => {
  try {
    const provider = await providersService.getProviderById(req.params['id'] as string);
    res.status(200).json(provider);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const updateProvider = async (req: Request, res: Response) => {
  try {
    const provider = await providersService.updateProvider(req.params['id'] as string, req.body);
    res.status(200).json(provider);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProvider = async (req: Request, res: Response) => {
  try {
    await providersService.softDeleteProvider(req.params['id'] as string);
    res.status(200).json({ message: 'Provider deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const addService = async (req: Request, res: Response) => {
  try {
    const { serviceId, price } = req.body;
    const providerId = req.params['id'] as string;
    if (!serviceId || !price) {
      res.status(400).json({ message: 'ServiceId and price are required' });
      return;
    }
    const result = await providersService.addServiceToProvider(providerId, serviceId, price);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getProviderServices = async (req: Request, res: Response) => {
  try {
    const services = await providersService.getProviderServices(req.params['id'] as string);
    res.status(200).json(services);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};