import { BaseRepository } from '../BaseRepository';
import { Message, DbResponse, DbResponseArray, MessageStatus, MessageSubject } from '../../types/database';
import { PaginationParams } from '../../types/express';

export class MessageRepository extends BaseRepository<Message> {
  constructor() {
    super('messages', true); // Use admin client
  }

  async findByStatus(status: MessageStatus, pagination?: PaginationParams): Promise<DbResponseArray<Message>> {
    return this.findAll({ status }, pagination);
  }

  async findBySubject(subject: MessageSubject, pagination?: PaginationParams): Promise<DbResponseArray<Message>> {
    return this.findAll({ subject }, pagination);
  }

  async findByEmail(email: string, pagination?: PaginationParams): Promise<DbResponseArray<Message>> {
    return this.findAll({ email }, pagination);
  }

  async updateStatus(id: string, status: MessageStatus): Promise<DbResponse<Message>> {
    return this.update(id, { status });
  }

  async findUnread(pagination?: PaginationParams): Promise<DbResponseArray<Message>> {
    return this.findAll({ status: 'New' }, pagination);
  }
}
