import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ProductCreateInput, ProductUpdateInput, productCreateSchema, productUpdateSchema } from '../utils/validation';
import prisma from '../lib/prisma';

export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validatedData: ProductCreateInput = productCreateSchema.parse(req.body);

    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        userId: req.user!.id, 
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error during product creation' });
    }
  }
};

export const getProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Optional: Add pagination, filtering, sorting later
    const products = await prisma.product.findMany({
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error while fetching products' });
  }
};

export const getProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error while fetching product' });
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData: ProductUpdateInput = productUpdateSchema.parse(req.body);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (existingProduct.userId !== req.user!.id) {
      res.status(403).json({ message: 'Not authorized to update this product' });
      return;
    }

    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        res.status(400).json({ message: 'Invalid category ID' });
        return;
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error during product update' });
    }
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (existingProduct.userId !== req.user!.id) {
      res.status(403).json({ message: 'Not authorized to delete this product' });
      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error during product deletion' });
  }
};