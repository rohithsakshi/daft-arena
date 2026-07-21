import { VenueRepository, PlayingAreaRepository } from '../repositories';
import { IVenue } from '../models/Venue';
import { IPlayingArea } from '../models/PlayingArea';
import { NotFoundException, ConflictException } from '../../core/exceptions';
import { QueryOptionsDto } from '../../core/dto';
import { PaginatedResponse } from '../../core/interfaces';

export class VenueService {
  constructor(
    private readonly venueRepo: VenueRepository,
    private readonly playingAreaRepo: PlayingAreaRepository
  ) {}

  async createVenue(data: Partial<IVenue>, userId: string): Promise<IVenue> {
    return this.venueRepo.create({
      ...data,
      createdBy: userId,
      updatedBy: userId
    });
  }

  async getVenue(id: string): Promise<IVenue> {
    const venue = await this.venueRepo.findById(id);
    if (!venue) throw new NotFoundException('Venue');
    return venue;
  }

  async updateVenue(id: string, data: Partial<IVenue>, userId: string): Promise<IVenue> {
    await this.getVenue(id);
    const updated = await this.venueRepo.update(id, { ...data, updatedBy: userId });
    return updated!;
  }

  async listVenues(options: QueryOptionsDto): Promise<PaginatedResponse<IVenue>> {
    const { query, ...paginateOptions } = options;
    if (query) {
      const { data, ...meta } = await this.venueRepo.search(query, ['name', 'address.city', 'address.country'], {}, paginateOptions);
      return { data, meta };
    }
    const { data, ...meta } = await this.venueRepo.paginate({}, paginateOptions);
    return { data, meta };
  }

  // Playing Areas
  async createPlayingArea(venueId: string, data: Partial<IPlayingArea>, userId: string): Promise<IPlayingArea> {
    await this.getVenue(venueId);
    
    const existing = await this.playingAreaRepo.findOne({ venueId, name: data.name });
    if (existing) {
      throw new ConflictException(`Playing area with name ${data.name} already exists in this venue`);
    }

    return this.playingAreaRepo.create({
      ...data,
      venueId,
      createdBy: userId,
      updatedBy: userId
    });
  }

  async getPlayingArea(id: string): Promise<IPlayingArea> {
    const area = await this.playingAreaRepo.findById(id);
    if (!area) throw new NotFoundException('PlayingArea');
    return area;
  }

  async listPlayingAreas(venueId: string, options: QueryOptionsDto): Promise<PaginatedResponse<IPlayingArea>> {
    const { query, ...paginateOptions } = options;
    const filter = { venueId };
    
    if (query) {
      const { data, ...meta } = await this.playingAreaRepo.search(query, ['name', 'type'], filter, paginateOptions);
      return { data, meta };
    }
    const { data, ...meta } = await this.playingAreaRepo.paginate(filter, paginateOptions);
    return { data, meta };
  }
}
