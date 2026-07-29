import { BaseRepository } from '../BaseRepository';
import { Property, PropertyFilters, DbResponse, DbResponseArray, PropertyStatus } from '../../types/database';
import { PaginationParams } from '../../types/express';

export class PropertyRepository extends BaseRepository<Property> {
  constructor() {
    super('properties', true); // Use admin client for now
  }

  async findAvailable(filters?: PropertyFilters, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    const baseFilters = {
      ...filters,
      status: 'Approved' as const,
      broker_verified: true
    };
    return this.findAll(baseFilters, pagination);
  }

  async findByBroker(brokerId: string, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.findAll({ broker_id: brokerId }, pagination);
  }

  async findByLocation(location: string, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.findAll({ location }, pagination);
  }

  async findByCity(city: string, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.findAll({ city }, pagination);
  }

  async findByType(propertyType: string, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.findAll({ property_type: propertyType }, pagination);
  }

  async findByPriceRange(minPrice: number, maxPrice: number, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    let query = this.getClient()
      .from(this.tableName)
      .select('*')
      .gte('price_etb', minPrice)
      .lte('price_etb', maxPrice)
      .eq('status', 'Approved')
      .eq('broker_verified', true);

    if (pagination) {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);
    }

    const { data, error } = await query;
    return { data, error: error as Error | null };
  }

  async findByLandSizeRange(minSize: number, maxSize: number, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    let query = this.getClient()
      .from(this.tableName)
      .select('*')
      .gte('land_size_sqm', minSize)
      .lte('land_size_sqm', maxSize)
      .eq('status', 'Approved')
      .eq('broker_verified', true);

    if (pagination) {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);
    }

    const { data, error } = await query;
    return { data, error: error as Error | null };
  }

  async searchProperties(searchTerm: string, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    let query = this.getClient()
      .from(this.tableName)
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`)
      .eq('status', 'Approved')
      .eq('broker_verified', true);

    if (pagination) {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);
    }

    const { data, error } = await query;
    return { data, error: error as Error | null };
  }

  async updateStatus(id: string, status: PropertyStatus): Promise<DbResponse<Property>> {
    return this.update(id, { status });
  }
}
