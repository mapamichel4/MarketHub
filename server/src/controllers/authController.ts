import { Request, Response } from 'express';
import { RegisterInput, LoginInput, registerSchema, loginSchema } from '../utils/validation';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import prisma from '../lib/prisma';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate input
    const validatedData: RegisterInput = registerSchema.parse(req.body);

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      res.status(409).json({ message: 'User already exists with this email' });
      return;
    }

    // 3. Hash the password
    const hashedPassword = await hashPassword(validatedData.password);

    // 4. Create user in database
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash: hashedPassword,
        name: validatedData.name,
        location: validatedData.location,
        // avatarUrl, bio, phone, paymentMethods can be added later by the user
      },
      // Select only the fields we want to send back to the client
      select: {
        id: true,
        email: true,
        name: true,
        location: true,
        createdAt: true,
      },
    });

    // 5. Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email });

    // 6. Send response
    res.status(201).json({
      message: 'User created successfully',
      user,
      token,
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error during registration' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Validate input
    const validatedData: LoginInput = loginSchema.parse(req.body);

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // 3. Check if user exists and password is correct
    if (!user || !(await verifyPassword(validatedData.password, user.passwordHash))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // 4. Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email });

    // 5. Send response (omit passwordHash)
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error during login' });
    }
  }
};