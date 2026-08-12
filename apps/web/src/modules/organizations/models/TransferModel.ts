import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITransferDoc extends Document {
  playerId: string;
  fromOrgId?: string;
  toOrgId: string;
  status: string;
  effectiveDate: Date;
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransferSchema = new Schema<ITransferDoc>({
  playerId: { type: String, required: true, index: true },
  fromOrgId: { type: String, index: true },
  toOrgId: { type: String, required: true, index: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  effectiveDate: { type: Date, required: true },
  reason: { type: String }
}, { timestamps: true });

export const TransferModel: Model<ITransferDoc> = mongoose.models.Transfer || mongoose.model<ITransferDoc>('Transfer', TransferSchema);
