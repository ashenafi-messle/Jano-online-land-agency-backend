import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../../services/messages/MessageService';
import { ApiResponse, PaginationParams } from '../../types/express';

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  getAllMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, subject, email, page = '1', limit = '10' } = req.query;

      const filters: any = {};
      if (status) filters.status = status;
      if (subject) filters.subject = subject;
      if (email) filters.email = email;

      const pagination: PaginationParams = {
        page: Number(page),
        limit: Number(limit)
      };

      const result = await this.messageService.getAllMessages(filters, pagination);

      if (result.error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch messages',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: result.data,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: result.data?.length || 0
        }
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getMessageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.messageService.getMessageById(id);

      if (result.error) {
        res.status(404).json({
          success: false,
          error: 'Message not found',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: result.data
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messageData = req.body;
      const result = await this.messageService.createMessage(messageData);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Failed to create message',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: 'Message sent successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateMessageStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await this.messageService.updateMessageStatus(id, status);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Failed to update message status',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Message status updated successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.messageService.deleteMessage(id);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Failed to delete message',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Message deleted successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
