import { ICourtStatus } from '../models';

export class CourtRepository {
  private static courts: ICourtStatus[] = [];
  
  async findAll(tournamentId: string): Promise<ICourtStatus[]> {
    return CourtRepository.courts;
  }
}
