import { MessageRepository } from '../../repositories/messages/MessageRepository';
import { Message, DbResponse, DbResponseArray, MessageStatus, MessageSubject } from '../../types/database';
import { PaginationParams } from '../../types/express';

export class MessageService {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  async getAllMessages(filters?: any, pagination?: PaginationParams): Promise<DbResponseArray<Message>> {
    return this.messageRepository.findAll(filters, pagination);
  }

  async getMessageById(id: string): Promise<DbResponse<Message>> {
    return this.messageRepository.findById(id);
  }

  async getMessagesByStatus(status: MessageStatus, pagination?: PaginationParams): Promise<DbResponseArray<Message>> {
    return this.messageRepository.findByStatus(status, pagination);
  }

  async getMessagesBySubject(subject: MessageSubject, pagination?: PaginationParams): Promise<DbResponseArray<Message>> {
    return this.messageRepository.findBySubject(subject, pagination);
  }

  async getMessagesByEmail(email: string, pagination?: PaginationParams): Promise<DbResponseArray<Message>> {
    return this.messageRepository.findByEmail(email, pagination);
  }

  async getUnreadMessages(pagination?: PaginationParams): Promise<DbResponseArray<Message>> {
    return this.messageRepository.findUnread(pagination);
  }

  async createMessage(messageData: Partial<Message>): Promise<DbResponse<Message>> {
    return this.messageRepository.create(messageData);
  }

  async updateMessage(id: string, messageData: Partial<Message>): Promise<DbResponse<Message>> {
    return this.messageRepository.update(id, messageData);
  }

  async updateMessageStatus(id: string, status: MessageStatus): Promise<DbResponse<Message>> {
    return this.messageRepository.updateStatus(id, status);
  }

  async deleteMessage(id: string): Promise<DbResponse<Message>> {
    return this.messageRepository.delete(id);
  }
}
