import { BaseRepository } from '../BaseRepository';
import { Broker, DbResponse, DbResponseArray } from '../../types/database';
import { PaginationParams } from '../../types/express';

export class BrokerAuthRepository extends BaseRepository<Broker> {
  constructor() {
    super('brokers', true); // Use admin client
  }

  async findByEmail(email: string): Promise<DbResponse<Broker>> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      return { data: null, error: error as Error };
    }
    return { data, error: null };
  }

  async createBroker(brokerData: Partial<Broker>): Promise<DbResponse<Broker>> {
    return this.create(brokerData);
  }

  async updateBroker(id: string, brokerData: Partial<Broker>): Promise<DbResponse<Broker>> {
    return this.update(id, brokerData);
  }

  async updateVerificationStatus(id: string, status: 'Pending Verification' | 'Approved' | 'Rejected'): Promise<DbResponse<Broker>> {
    return this.update(id, { verification_status: status });
  }
}
