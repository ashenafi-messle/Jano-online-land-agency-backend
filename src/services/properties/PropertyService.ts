import { PropertyRepository } from '../../repositories/properties/PropertyRepository';
import { Property, PropertyFilters, DbResponse, DbResponseArray } from '../../types/database';
import { PaginationParams } from '../../types/express';

export class PropertyService {
  private propertyRepository: PropertyRepository;

  constructor() {
    this.propertyRepository = new PropertyRepository();
  }

  async getAllProperties(filters?: PropertyFilters, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.propertyRepository.findAvailable(filters, pagination);
  }

  async getPropertyById(id: string): Promise<DbResponse<Property>> {
    return this.propertyRepository.findById(id);
  }

  async searchProperties(searchTerm: string, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.propertyRepository.searchProperties(searchTerm, pagination);
  }

  async getPropertiesByCity(city: string, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.propertyRepository.findByCity(city, pagination);
  }

  async getPropertiesByCategory(category: string, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.propertyRepository.findByType(category, pagination);
  }

  async getPropertiesByPriceRange(minPrice: number, maxPrice: number, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.propertyRepository.findByPriceRange(minPrice, maxPrice, pagination);
  }

  async getPropertiesBySizeRange(minSize: number, maxSize: number, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.propertyRepository.findByLandSizeRange(minSize, maxSize, pagination);
  }

  async getFeaturedProperties(pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    const filters: PropertyFilters = {
      featured: true,
      status: 'Approved',
      broker_verified: true
    };
    return this.propertyRepository.findAvailable(filters, pagination);
  }

  async getPropertiesByBroker(brokerId: string, pagination?: PaginationParams): Promise<DbResponseArray<Property>> {
    return this.propertyRepository.findByBroker(brokerId, pagination);
  }

  async createProperty(propertyData: Partial<Property>): Promise<DbResponse<Property>> {
    return this.propertyRepository.create(propertyData);
  }

  async updateProperty(id: string, propertyData: Partial<Property>): Promise<DbResponse<Property>> {
    return this.propertyRepository.update(id, propertyData);
  }

  async deleteProperty(id: string): Promise<DbResponse<Property>> {
    return this.propertyRepository.delete(id);
  }

  async updatePropertyStatus(id: string, status: 'Pending Verification' | 'Approved' | 'Rejected'): Promise<DbResponse<Property>> {
    return this.propertyRepository.updateStatus(id, status);
  }

  async incrementViews(id: string): Promise<DbResponse<Property>> {
    const { data } = await this.propertyRepository.findById(id);
    if (!data) {
      return { data: null, error: new Error('Property not found') };
    }
    
    return this.propertyRepository.update(id, {
      views_count: (data.views_count || 0) + 1
    });
  }
}
