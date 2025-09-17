import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { MessageCreateInput, messageCreateSchema } from '../utils/validation';
import prisma from '../lib/prisma';

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validatedData: MessageCreateInput = messageCreateSchema.parse(req.body);

    const receiver = await prisma.user.findUnique({
      where: { id: validatedData.receiverId },
    });

    if (!receiver) {
      res.status(404).json({ message: 'Receiver not found' });
      return;
    }

    if (validatedData.productId) {
      const product = await prisma.product.findUnique({
        where: { id: validatedData.productId },
      });

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
    }

    if (validatedData.receiverId === req.user!.id) {
      res.status(400).json({ message: 'Cannot send message to yourself' });
      return;
    }

    const message = await prisma.message.create({
      data: {
        content: validatedData.content,
        senderId: req.user!.id,
        receiverId: validatedData.receiverId,
        productId: validatedData.productId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        product: validatedData.productId ? {
          select: {
            id: true,
            title: true,
            price: true,
          },
        } : false,
      },
    });

    // 6. Send response
    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error while sending message' });
    }
  }
};

export const getConversations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
  
      // Get all unique conversations for the authenticated user
      const conversations = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        distinct: ['senderId', 'receiverId'],
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      // Format conversations to show the other participant
      const formattedConversations = conversations.map((conv: any) => {
        const otherUser = conv.senderId === userId ? conv.receiver : conv.sender;
        const lastMessage = conv.content.length > 50 
          ? conv.content.substring(0, 50) + '...' 
          : conv.content;
  
        return {
          id: conv.id,
          otherUser,
          lastMessage,
          createdAt: conv.createdAt,
          unreadCount: 0, // You can implement unread count later
        };
      });
  
      res.status(200).json(formattedConversations);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error while fetching conversations' });
    }
  };

export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { otherUserId } = req.params;

    const conversationExists = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
    });

    if (!conversationExists) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error while fetching messages' });
  }
};