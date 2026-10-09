import { Request, Response } from 'express';
import * as reviewsService from './reviews.service';

export const createReview = async (req: any, res: Response) => {
  try {
    const data = { ...req.body, userId: req.user.id };
    const review = await reviewsService.createReview(data);
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getProviderReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewsService.getProviderReviews(
      req.params['providerId'] as string
    );
    res.status(200).json(reviews);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReview = async (req: any, res: Response) => {
  try {
    await reviewsService.deleteReview(req.params['id'] as string, req.user.id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};