import { PasswordResetRepository } from '../../repositories/brokers/PasswordResetRepository';
import { BrokerAuthRepository } from '../../repositories/brokers/BrokerAuthRepository';
import { DbResponse } from '../../types/database';
import { supabaseAdmin } from '../../config/database';
import crypto from 'crypto';

export class PasswordResetService {
  private passwordResetRepository: PasswordResetRepository;
  private brokerAuthRepository: BrokerAuthRepository;

  constructor() {
    this.passwordResetRepository = new PasswordResetRepository();
    this.brokerAuthRepository = new BrokerAuthRepository();
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private getResetLink(token: string): string {
    // In production, this should be your frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return `${frontendUrl}/reset-password?token=${token}`;
  }

  private async sendResetEmail(email: string, resetLink: string, brokerName: string): Promise<boolean> {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'ashurack664@gmail.com';
    
    console.log('=== Starting email send process ===');
    console.log('Email to:', email);
    console.log('Broker name:', brokerName);
    console.log('Reset link:', resetLink);
    console.log('Brevo API Key present:', !!brevoApiKey);
    console.log('Sender email:', senderEmail);
    
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY not configured');
      return false;
    }

    try {
      console.log('Sending request to Brevo API...');
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify({
          sender: {
            name: 'Jano Online Land Agency',
            email: senderEmail,
          },
          to: [
            {
              email: email,
              name: brokerName,
            },
          ],
          subject: 'Reset Your Jano Broker Portal Password',
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #064e3b 0%, #0f766e 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">Jano Online Land Agency</h1>
                </div>
                
                <h2 style="color: #064e3b; margin-bottom: 20px;">Password Reset Request</h2>
                
                <p>Dear ${brokerName},</p>
                
                <p>We received a request to reset your password for your Jano Broker Portal account. If you didn't make this request, you can safely ignore this email.</p>
                
                <p>To reset your password, click the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="display: inline-block; background-color: #D4AF37; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #064e3b;">${resetLink}</p>
                
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                  This link will expire in 1 hour for security reasons.<br>
                  If you have any questions, please contact our support team.
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #666;">
                  <p>&copy; ${new Date().getFullYear()} Jano Online Land Agency. All rights reserved.</p>
                  <p>Bole Atlas, Olympic Building 4th Floor, Addis Ababa, Ethiopia</p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      console.log('Brevo API response status:', response.status);
      console.log('Brevo API response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Brevo API error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.error('Brevo API error parsed:', errorData);
        } catch (e) {
          console.error('Could not parse error as JSON');
        }
        return false;
      }

      const responseData = await response.json();
      console.log('Brevo API success response:', responseData);
      console.log('=== Email sent successfully ===');
      return true;
    } catch (error) {
      console.error('Error sending reset email:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  async requestPasswordReset(email: string): Promise<DbResponse<{ message: string }>> {
    try {
      // Find broker by email
      const brokerResult = await this.brokerAuthRepository.findByEmail(email);
      
      if (!brokerResult.data) {
        // Don't reveal if email exists for security
        return { data: { message: 'If an account exists with this email, a reset link has been sent.' }, error: null };
      }

      const broker = brokerResult.data;

      // Delete any existing unused tokens for this broker
      const existingTokens = await this.passwordResetRepository.findByBrokerId(broker.id);
      if (existingTokens.data) {
        for (const token of existingTokens.data) {
          if (!token.used) {
            await this.passwordResetRepository.deleteToken(token.token);
          }
        }
      }

      // Generate new reset token
      const token = this.generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Store token in database
      await this.passwordResetRepository.createToken({
        broker_id: broker.id,
        token,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

      // Generate reset link
      const resetLink = this.getResetLink(token);

      // Send email
      const emailSent = await this.sendResetEmail(email, resetLink, broker.full_name);
      
      if (!emailSent) {
        return { data: null, error: new Error('Failed to send reset email') };
      }

      return { data: { message: 'If an account exists with this email, a reset link has been sent.' }, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Password reset request failed') };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<DbResponse<{ message: string }>> {
    try {
      console.log('=== Reset password service ===');
      console.log('Token:', token);
      
      // Find token
      const tokenResult = await this.passwordResetRepository.findByToken(token);
      console.log('Token result:', tokenResult);
      
      if (!tokenResult.data) {
        return { data: null, error: new Error('Invalid or expired reset token') };
      }

      const resetToken = tokenResult.data;
      console.log('Reset token found:', resetToken);

      // Check if token is already used
      if (resetToken.used) {
        return { data: null, error: new Error('This reset link has already been used') };
      }

      // Check if token is expired
      if (new Date(resetToken.expires_at) < new Date()) {
        await this.passwordResetRepository.deleteToken(token);
        return { data: null, error: new Error('This reset link has expired') };
      }

      console.log('Updating password in Supabase Auth for broker_id:', resetToken.broker_id);
      
      // First, check if the user exists in Supabase Auth
      const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(resetToken.broker_id);
      console.log('User check result:', { user: !!user, error: userError });
      
      if (userError || !user) {
        console.error('User not found in Supabase Auth, trying to find by email...');
        // User not found in Supabase Auth, try to find broker by email and get their auth user
        const brokerResult = await this.brokerAuthRepository.findById(resetToken.broker_id);
        if (brokerResult.data && brokerResult.data.email) {
          console.log('Broker email:', brokerResult.data.email);
          // Try to list users by email to find the auth user
          const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
          console.log('List users error:', listError);
          
          if (!listError && users && brokerResult.data) {
            const authUser = users.users.find(u => u.email === brokerResult.data!.email);
            if (authUser) {
              console.log('Found auth user by email:', authUser.id);
              // Update the password reset token with the correct auth user ID
              await this.passwordResetRepository.deleteToken(token);
              await this.passwordResetRepository.createToken({
                broker_id: resetToken.broker_id,
                token: token,
                expires_at: resetToken.expires_at,
                used: false,
              });
              // Update password using the correct auth user ID
              const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                authUser.id,
                { password: newPassword }
              );
              if (updateError) {
                console.error('Failed to update password with auth user ID:', updateError);
                return { data: null, error: new Error('Failed to update password') };
              }
              // Mark token as used
              await this.passwordResetRepository.markAsUsed(token);
              return { data: { message: 'Password reset successfully' }, error: null };
            }
          }
        }
        return { data: null, error: new Error('User not found in authentication system. Please contact support.') };
      }
      
      // Update broker password in Supabase Auth
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        resetToken.broker_id,
        { password: newPassword }
      );

      console.log('Supabase update result - error:', updateError);
      if (updateError) {
        console.error('Supabase update error details:', updateError);
        return { data: null, error: new Error('Failed to update password') };
      }

      // Mark token as used
      await this.passwordResetRepository.markAsUsed(token);

      return { data: { message: 'Password reset successfully' }, error: null };
    } catch (error) {
      console.error('Reset password service error:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Password reset failed') };
    }
  }

  async validateToken(token: string): Promise<DbResponse<{ valid: boolean; brokerId?: string }>> {
    try {
      const tokenResult = await this.passwordResetRepository.findByToken(token);
      
      if (!tokenResult.data) {
        return { data: { valid: false }, error: null };
      }

      const resetToken = tokenResult.data;

      // Check if token is already used
      if (resetToken.used) {
        return { data: { valid: false }, error: null };
      }

      // Check if token is expired
      if (new Date(resetToken.expires_at) < new Date()) {
        await this.passwordResetRepository.deleteToken(token);
        return { data: { valid: false }, error: null };
      }

      return { data: { valid: true, brokerId: resetToken.broker_id }, error: null };
    } catch (error) {
      return { data: { valid: false }, error: error instanceof Error ? error : new Error('Token validation failed') };
    }
  }
}
