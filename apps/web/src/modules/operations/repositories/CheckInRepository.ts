import { ICheckIn } from '../models';

export class CheckInRepository {
  private static checkIns: ICheckIn[] = [];
  
  async findAll(tournamentId: string): Promise<ICheckIn[]> {
    return CheckInRepository.checkIns.filter(c => c.tournamentId === tournamentId);
  }
  
  async create(checkIn: ICheckIn): Promise<ICheckIn> {
    CheckInRepository.checkIns.push(checkIn);
    return checkIn;
  }
}
