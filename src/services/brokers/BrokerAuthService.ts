import { BrokerAuthRepository } from '../../repositories/brokers/BrokerAuthRepository';
import { Broker, DbResponse } from '../../types/database';
import { supabaseAdmin } from '../../config/database';

export class BrokerAuthService {
  private brokerAuthRepository: BrokerAuthRepository;

  constructor() {
    this.brokerAuthRepository = new BrokerAuthRepository();
  }

  async registerBroker(brokerData: Partial<Broker> & { password: string }): Promise<DbResponse<Broker>> {
    try {
      // Check if broker with email already exists in our database
      const existingBroker = await this.brokerAuthRepository.findByEmail(brokerData.email!);
      if (existingBroker.data) {
        return { data: null, error: new Error('Broker with this email already exists') };
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: brokerData.email!,
        password: brokerData.password,
        email_confirm: true,
        user_metadata: {
          full_name: brokerData.full_name,
          role: 'broker',
        },
      });

      if (authError) {
        return { data: null, error: new Error(`Auth error: ${authError.message}`) };
      }

      // Remove password from data before storing in brokers table
      const { password, ...brokerDataWithoutPassword } = brokerData;

      // Create broker record with the Supabase user ID
      const newBroker = {
        ...brokerDataWithoutPassword,
        id: authData.user.id,
        rating: 0,
        total_reviews: 0,
        subscription_plan: 'Basic Broker' as const,
        subscription_status: 'Active' as const,
      };

      return this.brokerAuthRepository.createBroker(newBroker);
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Registration failed') };
    }
  }

  async loginBroker(email: string, password: string): Promise<DbResponse<Broker>> {
    try {
      // Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        return { data: null, error: new Error('Invalid email or password') };
      }

      // Find broker record by user ID
      const result = await this.brokerAuthRepository.findById(authData.user.id);
      
      if (!result.data) {
        return { data: null, error: new Error('Broker profile not found') };
      }

      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Login failed') };
    }
  }

  async getBrokerById(id: string): Promise<DbResponse<Broker>> {
    return this.brokerAuthRepository.findById(id);
  }

  async updateBrokerProfile(id: string, brokerData: Partial<Broker>): Promise<DbResponse<Broker>> {
    return this.brokerAuthRepository.updateBroker(id, brokerData);
  }
}
