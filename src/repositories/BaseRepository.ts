import { supabaseClient, supabaseAdmin } from '../config/database';
import { DbResponse, DbResponseArray } from '../types/database';
import { PaginationParams } from '../types/express';

export abstract class BaseRepository<T> {
  protected tableName: string;
  protected useAdmin: boolean = false;

  constructor(tableName: string, useAdmin: boolean = false) {
    this.tableName = tableName;
    this.useAdmin = useAdmin;
  }

  protected getClient() {
    return this.useAdmin ? supabaseAdmin : supabaseClient;
  }

  async findAll(filters?: Record<string, any>, pagination?: PaginationParams): Promise<DbResponseArray<T>> {
    console.log(`Querying table: ${this.tableName}`);
    let query = this.getClient().from(this.tableName).select('*');

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    if (pagination) {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);
    }

    const { data, error } = await query;

    console.log(`Query result - data: ${data ? data.length : 0} items, error: ${error?.message}`);
    return { data, error: error as Error | null };
  }

  async findById(id: string): Promise<DbResponse<T>> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    return { data, error: error as Error | null };
  }

  async create(item: Partial<T>): Promise<DbResponse<T>> {
    console.log(`Creating item in table: ${this.tableName}`);
    console.log('Item data:', JSON.stringify(item, null, 2));
    
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .insert(item as any)
      .select()
      .single();

    if (error) {
      console.error('Create error:', error);
    }
    
    return { data, error: error as Error | null };
  }

  async update(id: string, item: Partial<T>): Promise<DbResponse<T>> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .update(item as any)
      .eq('id', id)
      .select()
      .single();

    return { data, error: error as Error | null };
  }

  async delete(id: string): Promise<DbResponse<T>> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .select()
      .single();

    return { data, error: error as Error | null };
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let query = this.getClient().from(this.tableName).select('*', { count: 'exact', head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { count, error } = await query;

    if (error) {
      throw error;
    }

    return count || 0;
  }

  async exists(id: string): Promise<boolean> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .single();

    return !error && !!data;
  }
}
