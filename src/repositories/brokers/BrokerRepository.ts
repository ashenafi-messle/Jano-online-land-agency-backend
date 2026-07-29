import { BaseRepository } from '../BaseRepository';
import { Broker, DbResponse, DbResponseArray } from '../../types/database';
import { PaginationParams } from '../../types/express';

export class BrokerRepository extends BaseRepository<Broker> {
  constructor() {
    super('brokers');
  }

  async findByEmail(email: string): Promise<DbResponse<Broker>> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    return { data, error: error as Error | null };
  }

  async findApproved(pagination?: PaginationParams): Promise<DbResponseArray<Broker>> {
    return this.findAll({ is_approved: true }, pagination);
  }

  async findActive(pagination?: PaginationParams): Promise<DbResponseArray<Broker>> {
    return this.findAll({ is_active: true, is_approved: true }, pagination);
  }

  async updateApprovalStatus(id: string, isApproved: boolean): Promise<DbResponse<Broker>> {
    return this.update(id, { is_approved: isApproved });
  }

  async updateActiveStatus(id: string, isActive: boolean): Promise<DbResponse<Broker>> {
    return this.update(id, { is_active: isActive });
  }

  async updateProfile(id: string, profileData: Partial<Broker>): Promise<DbResponse<Broker>> {
    return this.update(id, profileData);
  }
}
