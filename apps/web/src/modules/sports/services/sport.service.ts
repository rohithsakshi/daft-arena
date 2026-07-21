import { SportRepository } from '../repositories';
import { ISport } from '../models/Sport';
import { ConflictException, NotFoundException } from '../../core/exceptions';
import { QueryOptionsDto } from '../../core/dto';
import { PaginatedResponse } from '../../core/interfaces';

export class SportService {
  constructor(private readonly sportRepository: SportRepository) {}

  async createSport(data: Partial<ISport>, userId: string): Promise<ISport> {
    const existing = await this.sportRepository.findBySlug(data.slug!);
    if (existing) {
      throw new ConflictException(`Sport with slug ${data.slug} already exists`);
    }

    return this.sportRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId
    });
  }

  async updateSport(id: string, data: Partial<ISport>, userId: string): Promise<ISport> {
    if (data.slug) {
      const existing = await this.sportRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Sport with slug ${data.slug} already exists`);
      }
    }

    const updated = await this.sportRepository.update(id, {
      ...data,
      updatedBy: userId
    });

    if (!updated) {
      throw new NotFoundException('Sport');
    }

    return updated;
  }

  async getSport(id: string): Promise<ISport> {
    const sport = await this.sportRepository.findById(id);
    if (!sport) {
      throw new NotFoundException('Sport');
    }
    return sport;
  }

  async getSportBySlug(slug: string): Promise<ISport> {
    const sport = await this.sportRepository.findBySlug(slug);
    if (!sport) {
      throw new NotFoundException('Sport');
    }
    return sport;
  }

  async listSports(options: QueryOptionsDto): Promise<PaginatedResponse<ISport>> {
    const { query, ...paginateOptions } = options;
    if (query) {
      const { data, ...meta } = await this.sportRepository.search(query, ['name', 'displayName', 'description'], {}, paginateOptions);
      return { data, meta };
    }
    const { data, ...meta } = await this.sportRepository.paginate({}, paginateOptions);
    return { data, meta };
  }

  async deleteSport(id: string, userId: string): Promise<boolean> {
    await this.getSport(id);
    await this.sportRepository.update(id, { updatedBy: userId });
    return this.sportRepository.delete(id);
  }

  async duplicateSport(id: string, newSlug: string, newName: string, userId: string): Promise<ISport> {
    const existing = await this.getSport(id);
    
    const cloneData = {
      ...existing,
      id: undefined,
      _id: undefined,
      slug: newSlug,
      name: newName,
      displayName: newName
    };

    return this.createSport(cloneData, userId);
  }
}
