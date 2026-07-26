import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export type ApprovalWorkflowType =
  | 'TournamentSanction'
  | 'ClubAffiliation'
  | 'PlayerTransfer'
  | 'LicenseApproval'
  | 'OfficialCertification'
  | 'PlayerRegistration';

export type ApprovalStepStatus = 'Pending' | 'Approved' | 'Rejected' | 'Skipped';
export type WorkflowStatus = 'Pending' | 'InProgress' | 'Approved' | 'Rejected' | 'Withdrawn';

export interface IApprovalStep {
  stepNumber: number;
  approverRole: string;
  approverId?: string;
  status: ApprovalStepStatus;
  comments?: string;
  decidedAt?: Date;
}

export interface IApprovalWorkflow extends IBaseDocument {
  type: ApprovalWorkflowType;
  federationId: mongoose.Types.ObjectId | string;
  entityId: string;
  entityType: string;
  requestedBy: string;
  status: WorkflowStatus;
  steps: IApprovalStep[];
  currentStep: number;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  completedAt?: Date;
}

const ApprovalWorkflowSchema = createBaseSchema({
  type: {
    type: String,
    enum: ['TournamentSanction', 'ClubAffiliation', 'PlayerTransfer', 'LicenseApproval', 'OfficialCertification', 'PlayerRegistration'],
    required: true,
    index: true,
  },
  federationId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true, index: true },
  entityId: { type: String, required: true, index: true },
  entityType: { type: String, required: true },
  requestedBy: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'InProgress', 'Approved', 'Rejected', 'Withdrawn'],
    default: 'Pending',
    index: true,
  },
  steps: [
    {
      stepNumber: { type: Number, required: true },
      approverRole: { type: String, required: true },
      approverId: { type: String },
      status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Skipped'],
        default: 'Pending',
      },
      comments: { type: String },
      decidedAt: { type: Date },
    },
  ],
  currentStep: { type: Number, default: 0 },
  title: { type: String, required: true },
  description: { type: String },
  metadata: { type: Schema.Types.Mixed },
  completedAt: { type: Date },
});

export const ApprovalWorkflowModel: Model<IApprovalWorkflow> =
  mongoose.models.ApprovalWorkflow ||
  mongoose.model<IApprovalWorkflow>('ApprovalWorkflow', ApprovalWorkflowSchema);
