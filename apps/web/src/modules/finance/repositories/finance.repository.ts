// @ts-nocheck
import { BaseRepository } from '../../../lib/db/BaseRepository';
import { FinanceModel, IFinance } from '../models/Finance.schema';
export class FinanceRepository extends BaseRepository<IFinance> { constructor() { super(FinanceModel); } }
