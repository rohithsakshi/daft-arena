import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export type TransferStatus = 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn' | 'Completed';

export interface IPlayerTransfer extends IBaseDocument {
  federationId: mongoose.Types.ObjectId | string;
  playerId: mongoose.Types.ObjectId | string;
  fromFederationEntityId: mongoose.Types.ObjectId | string; // club/academy source
  toFederationEntityId: mongoose.Types.ObjectId | string;   // club/academy destination
  fromEntityType: 'Club' | 'Academy';
  toEntityType: 'Club' | 'Academy';
  status: TransferStatus;
  requestedBy: string;
  requestedAt: Date;
  effectiveDate: Date;
  transferFee?: number;
  reason?: string;
  approvalWorkflowId?: mongoose.Types.ObjectId | string;
  documents: { title: string; url: string }[];
  notes?: string;
  completedAt?: Date;
}

const PlayerTransferSchema = createBaseSchema({
  federationId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true, index: true },
  playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
  fromFederationEntityId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true },
  toFederationEntityId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true },
  fromEntityType: { type: String, enum: ['Club', 'Academy'], required: true },
  toEntityType: { type: String, enum: ['Club', 'Academy'], required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Withdrawn', 'Completed'],
    default: 'Pending',
    index: true,
  },
  requestedBy: { type: String, required: true },
  requestedAt: { type: Date, required: true },
  effectiveDate: { type: Date, required: true },
  transferFee: { type: Number },
  reason: { type: String },
  approvalWorkflowId: { type: Schema.Types.ObjectId, ref: 'ApprovalWorkflow' },
  documents: [{ title: { type: String }, url: { type: String } }],
  notes: { type: String },
  completedAt: { type: Date },
});

export const PlayerTransferModel: Model<IPlayerTransfer> =
  mongoose.models.PlayerTransfer ||
  mongoose.model<IPlayerTransfer>('PlayerTransfer', PlayerTransferSchema);
