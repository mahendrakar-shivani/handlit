import { Request, Response } from 'express';
import * as servicesService from './services.service';

export const getServices = async (req: Request, res: Response) => {
  try {
    const result = await servicesService.getAllServices(req.query);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getService = async (req: Request, res: Response) => {
  try {
    const service = await servicesService.getServiceById(req.params['id'] as string);
    res.status(200).json(service);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, categoryId, basePrice } = req.body;
    if (!name || !categoryId || !basePrice) {
      res.status(400).json({ message: 'Name, categoryId and basePrice are required' });
      return;
    }
    const service = await servicesService.createService(req.body);
    res.status(201).json(service);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await servicesService.updateService(req.params['id'] as string, req.body);
    res.status(200).json(service);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    await servicesService.softDeleteService(req.params['id'] as string);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await servicesService.getAllCategories();
    res.status(200).json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }
    const category = await servicesService.createCategory(name);
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};