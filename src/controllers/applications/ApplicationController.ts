import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../../services/applications/ApplicationService';
import { ApiResponse, PaginationParams } from '../../types/express';

export class ApplicationController {
  private applicationService: ApplicationService;

  constructor() {
    this.applicationService = new ApplicationService();
  }

  getAllApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { property_id, broker_id, status, email, page = '1', limit = '10' } = req.query;

      const filters: any = {};
      if (property_id) filters.property_id = property_id;
      if (broker_id) filters.broker_id = broker_id;
      if (status) filters.status = status;
      if (email) filters.email = email;

      const pagination: PaginationParams = {
        page: Number(page),
        limit: Number(limit)
      };

      const result = await this.applicationService.getAllApplications(filters, pagination);

      if (result.error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch applications',
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

  getApplicationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.applicationService.getApplicationById(id);

      if (result.error) {
        res.status(404).json({
          success: false,
          error: 'Application not found',
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

  getApplicationsByProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { propertyId } = req.params;
      const { page = '1', limit = '10' } = req.query;

      const pagination: PaginationParams = {
        page: Number(page),
        limit: Number(limit)
      };

      const result = await this.applicationService.getApplicationsByProperty(propertyId, pagination);

      if (result.error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch applications for property',
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

  getApplicationsByBroker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { brokerId } = req.params;
      const { page = '1', limit = '10' } = req.query;

      const pagination: PaginationParams = {
        page: Number(page),
        limit: Number(limit)
      };

      const result = await this.applicationService.getApplicationsByBroker(brokerId, pagination);

      if (result.error) {
        res.status(500).json({
          success: false,
          error: 'Failed to fetch applications for broker',
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

  createApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applicationData = req.body;
      const result = await this.applicationService.createApplication(applicationData);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Failed to create application',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: 'Application submitted successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await this.applicationService.updateApplicationStatus(id, status);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Failed to update application status',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Application status updated successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.applicationService.deleteApplication(id);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Failed to delete application',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Application deleted successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
