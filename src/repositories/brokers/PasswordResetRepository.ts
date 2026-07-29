import { BaseRepository } from '../BaseRepository';
import { DbResponse, DbResponseArray } from '../../types/database';

export interface PasswordResetToken {
  id: string;
  broker_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export class PasswordResetRepository extends BaseRepository<PasswordResetToken> {
  constructor() {
    super('password_reset_tokens', true); // Use admin client
  }

  async findByToken(token: string): Promise<DbResponse<PasswordResetToken>> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select('*')
      .eq('token', token)
      .single();

    if (error) {
      return { data: null, error: error as Error };
    }
    return { data, error: null };
  }

  async findByBrokerId(brokerId: string): Promise<DbResponseArray<PasswordResetToken>> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select('*')
      .eq('broker_id', brokerId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error as Error };
    }
    return { data: data || [], error: null };
  }

  async createToken(tokenData: Partial<PasswordResetToken>): Promise<DbResponse<PasswordResetToken>> {
    return this.create(tokenData);
  }

  async markAsUsed(token: string): Promise<DbResponse<PasswordResetToken>> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .update({ used: true })
      .eq('token', token)
      .select()
      .single();

    if (error) {
      return { data: null, error: error as Error };
    }
    return { data, error: null };
  }

  async deleteToken(token: string): Promise<DbResponse<PasswordResetToken>> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .delete()
      .eq('token', token);

    if (error) {
      return { data: null, error: error as Error };
    }
    return { data: null, error: null };
  }

  async deleteExpiredTokens(): Promise<void> {
    const { error } = await this.getClient()
      .from(this.tableName)
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error deleting expired tokens:', error);
    }
  }
}
