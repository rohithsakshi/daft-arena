// @ts-nocheck
import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
export interface IFinance extends IBaseDocument { type: string; amount: number; status: string; }
const FinanceSchema = createBaseSchema({ type: { type: String, required: true }, amount: { type: Number, required: true }, status: { type: String, default: 'Pending' }});
export const FinanceModel: Model<IFinance> = mongoose.models.Finance || mongoose.model<IFinance>('Finance', FinanceSchema);