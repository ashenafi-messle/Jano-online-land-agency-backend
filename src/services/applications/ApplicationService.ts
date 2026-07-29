import { ApplicationRepository } from '../../repositories/applications/ApplicationRepository';
import { Application, DbResponse, DbResponseArray, ApplicationStatus } from '../../types/database';
import { PaginationParams } from '../../types/express';

export class ApplicationService {
  private applicationRepository: ApplicationRepository;

  constructor() {
    this.applicationRepository = new ApplicationRepository();
  }

  async getAllApplications(filters?: any, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.applicationRepository.findAll(filters, pagination);
  }

  async getApplicationById(id: string): Promise<DbResponse<Application>> {
    return this.applicationRepository.findById(id);
  }

  async getApplicationsByProperty(propertyId: string, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.applicationRepository.findByProperty(propertyId, pagination);
  }

  async getApplicationsByBroker(brokerId: string, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.applicationRepository.findByBroker(brokerId, pagination);
  }

  async getApplicationsByStatus(status: ApplicationStatus, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.applicationRepository.findByStatus(status, pagination);
  }

  async getApplicationsByApplicantEmail(email: string, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.applicationRepository.findByApplicantEmail(email, pagination);
  }

  async createApplication(applicationData: Partial<Application>): Promise<DbResponse<Application>> {
    return this.applicationRepository.create(applicationData);
  }

  async updateApplication(id: string, applicationData: Partial<Application>): Promise<DbResponse<Application>> {
    return this.applicationRepository.update(id, applicationData);
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<DbResponse<Application>> {
    return this.applicationRepository.updateStatus(id, status);
  }

  async deleteApplication(id: string): Promise<DbResponse<Application>> {
    return this.applicationRepository.delete(id);
  }
}
