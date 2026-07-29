import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../../services/properties/PropertyService';
import { ApiResponse, PaginationParams } from '../../types/express';
import { PropertyFilters } from '../../types/database';

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  getAllProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        city,
        category,
        min_price,
        max_price,
        min_size,
        max_size,
        broker_verified,
        featured,
        search,
        page = '1',
        limit = '10',
        sort_by = 'created_at',
        sort_order = 'desc'
      } = req.query;

      const filters: PropertyFilters = {};
      
      if (city) filters.city = city as string;
      if (category) filters.category = category as any;
      if (min_price) filters.min_price = Number(min_price);
      if (max_price) filters.max_price = Number(max_price);
      if (min_size) filters.min_land_size = Number(min_size);
      if (max_size) filters.max_land_size = Number(max_size);
      if (broker_verified !== undefined) filters.broker_verified = broker_verified === 'true';
      if (featured !== undefined) filters.featured = featured === 'true';

      const pagination: PaginationParams = {
        page: Number(page),
        limit: Number(limit),
        sortBy: sort_by as string,
        sortOrder: sort_order as 'asc' | 'desc'
      };

      let result;
      if (search) {
        result = await this.propertyService.searchProperties(search as string, pagination);
      } else {
        result = await this.propertyService.getAllProperties(filters, pagination);
      }

      if (result.error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch properties',
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

  getPropertyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.propertyService.getPropertyById(id);

      if (result.error) {
        res.status(404).json({
          success: false,
          error: 'Property not found',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      // Increment views count
      await this.propertyService.incrementViews(id);

      res.json({
        success: true,
        data: result.data
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getPropertiesByCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { city } = req.params;
      const { page = '1', limit = '10' } = req.query;

      const pagination: PaginationParams = {
        page: Number(page),
        limit: Number(limit)
      };

      const result = await this.propertyService.getPropertiesByCity(city, pagination);

      if (result.error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch properties by city',
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

  getFeaturedProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = '1', limit = '10' } = req.query;

      const pagination: PaginationParams = {
        page: Number(page),
        limit: Number(limit)
      };

      const result = await this.propertyService.getFeaturedProperties(pagination);

      if (result.error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch featured properties',
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

  createProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const propertyData = req.body;
      const result = await this.propertyService.createProperty(propertyData);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Failed to create property',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: 'Property created successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const propertyData = req.body;
      const result = await this.propertyService.updateProperty(id, propertyData);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Failed to update property',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Property updated successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.propertyService.deleteProperty(id);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Failed to delete property',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Property deleted successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
