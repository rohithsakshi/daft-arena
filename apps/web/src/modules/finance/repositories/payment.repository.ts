import { BaseRepository } from '../../../lib/db/BaseRepository';
import { PaymentModel, IPayment } from '../models/Payment.schema';

export class PaymentRepository extends BaseRepository<IPayment> {
  constructor() {
    super(PaymentModel);
  }

  async findByTournament(tournamentId: string) {
    return this.findMany({ tournamentId });
  }

  async findPending() {
    return this.findMany({ status: 'PENDING' });
  }
}
