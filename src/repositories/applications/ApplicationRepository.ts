import { BaseRepository } from '../BaseRepository';
import { Application, DbResponse, DbResponseArray, ApplicationStatus } from '../../types/database';
import { PaginationParams } from '../../types/express';

export class ApplicationRepository extends BaseRepository<Application> {
  constructor() {
    super('applications', true); // Use admin client
  }

  async findByProperty(propertyId: string, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.findAll({ property_id: propertyId }, pagination);
  }

  async findByBroker(brokerId: string, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.findAll({ broker_id: brokerId }, pagination);
  }

  async findByStatus(status: ApplicationStatus, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.findAll({ status }, pagination);
  }

  async findByApplicantEmail(email: string, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.findAll({ email }, pagination);
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<DbResponse<Application>> {
    return this.update(id, { status });
  }

  async findByPropertyAndBroker(propertyId: string, brokerId: string, pagination?: PaginationParams): Promise<DbResponseArray<Application>> {
    return this.findAll({ property_id: propertyId, broker_id: brokerId }, pagination);
  }
}
