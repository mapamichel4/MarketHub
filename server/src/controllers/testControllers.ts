import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

export const getProtectedData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      message: 'You have accessed a protected route!',
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};