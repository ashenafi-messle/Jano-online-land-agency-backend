import { Request, Response, NextFunction } from 'express';
import { PasswordResetService } from '../../services/brokers/PasswordResetService';
import { ApiResponse } from '../../types/express';

export class PasswordResetController {
  private passwordResetService: PasswordResetService;

  constructor() {
    this.passwordResetService = new PasswordResetService();
  }

  requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          error: 'Email is required',
          message: 'Please provide your email address'
        } as ApiResponse);
        return;
      }

      const result = await this.passwordResetService.requestPasswordReset(email);

      if (result.error) {
        res.status(500).json({
          success: false,
          error: 'Failed to process password reset request',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: result.data,
        message: result.data?.message || 'Password reset email sent'
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  validateResetToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'Token is required',
          message: 'Reset token is required'
        } as ApiResponse);
        return;
      }

      const result = await this.passwordResetService.validateToken(token);

      if (result.error) {
        res.status(500).json({
          success: false,
          error: 'Token validation failed',
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

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, newPassword } = req.body;

      console.log('=== Password reset request ===');
      console.log('Token present:', !!token);
      console.log('Token length:', token?.length);
      console.log('New password present:', !!newPassword);
      console.log('New password length:', newPassword?.length);

      if (!token || !newPassword) {
        console.error('Missing required fields');
        res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Token and new password are required'
        } as ApiResponse);
        return;
      }

      if (newPassword.length < 6) {
        console.error('Password too short');
        res.status(400).json({
          success: false,
          error: 'Password too short',
          message: 'Password must be at least 6 characters long'
        } as ApiResponse);
        return;
      }

      console.log('Calling password reset service...');
      const result = await this.passwordResetService.resetPassword(token, newPassword);
      console.log('Password reset service result:', result);

      if (result.error) {
        console.error('Password reset failed:', result.error.message);
        res.status(400).json({
          success: false,
          error: 'Password reset failed',
          message: result.error.message
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        data: result.data,
        message: result.data?.message || 'Password reset successfully'
      } as ApiResponse);
    } catch (error) {
      console.error('Password reset controller error:', error);
      next(error);
    }
  };
}
