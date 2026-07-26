import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IPayment extends IBaseDocument {
  playerId: string;
  tournamentId: string;
  utr: string;
  amount: number;
  screenshotUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
}

const PaymentSchema = createBaseSchema({
  playerId: { type: String, required: true, index: true },
  tournamentId: { type: String, required: true, index: true },
  utr: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  screenshotUrl: { type: String },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  remarks: { type: String }
});

export const PaymentModel: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
