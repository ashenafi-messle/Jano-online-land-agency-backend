import { Request, Response, NextFunction } from 'express';
import { BrokerAuthService } from '../../services/brokers/BrokerAuthService';
import { ApiResponse } from '../../types/express';

export class BrokerAuthController {
  private brokerAuthService: BrokerAuthService;

  constructor() {
    this.brokerAuthService = new BrokerAuthService();
  }

  registerBroker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { full_name, email, password, phone, address, agency_name, biography, profile_photo } = req.body;

      console.log('Broker registration request:', { full_name, email, phone });

      if (!full_name || !email || !password || !phone) {
        console.log('Missing required fields:', { full_name, email, password, phone });
        res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Full name, email, password, and phone are required'
        } as ApiResponse);
        return;
      }

      const result = await this.brokerAuthService.registerBroker({
        full_name,
        email,
        password,
        phone,
        address,
        agency_name,
        biography,
        profile_photo,
      });

      console.log('Broker registration result:', result);

      if (result.error) {
        console.log('Broker registration error:', result.error);
        res.status(400).json({
          success: false,
          error: 'Registration failed',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: 'Broker registered successfully. Please wait for verification.'
      } as ApiResponse);
    } catch (error) {
      console.error('Broker registration exception:', error);
      next(error);
    }
  };

  loginBroker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Missing credentials',
          message: 'Email and password are required'
        } as ApiResponse);
        return;
      }

      const result = await this.brokerAuthService.loginBroker(email, password);

      if (result.error) {
        res.status(401).json({
          success: false,
          error: 'Login failed',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Login successful'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getBrokerProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.brokerAuthService.getBrokerById(id);

      if (result.error) {
        res.status(404).json({
          success: false,
          error: 'Broker not found',
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

  updateBrokerProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const brokerData = req.body;
      const result = await this.brokerAuthService.updateBrokerProfile(id, brokerData);

      if (result.error) {
        res.status(400).json({
          success: false,
          error: 'Update failed',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Broker profile updated successfully'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
