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
    return this.findAll({ subscription_status: 'Active' }, pagination);
  }

  async findActive(pagination?: PaginationParams): Promise<DbResponseArray<Broker>> {
    return this.findAll({ subscription_status: 'Active' }, pagination);
  }

  async updateApprovalStatus(id: string, isApproved: boolean): Promise<DbResponse<Broker>> {
    return this.update(id, { subscription_status: isApproved ? 'Active' : 'Pending' });
  }

  async updateActiveStatus(id: string, isActive: boolean): Promise<DbResponse<Broker>> {
    return this.update(id, { subscription_status: isActive ? 'Active' : 'Expired' });
  }

  async updateProfile(id: string, profileData: Partial<Broker>): Promise<DbResponse<Broker>> {
    return this.update(id, profileData);
  }
}
