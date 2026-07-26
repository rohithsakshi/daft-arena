import { connectDB } from '../../../lib/mongodb';
import { ApprovalWorkflowRepository } from '../repositories/ApprovalWorkflowRepository';
import { IApprovalWorkflow, ApprovalWorkflowType, IApprovalStep } from '../models/ApprovalWorkflow';
import { auditService } from '../../iam/services/audit.service';
import { notificationService } from '../../notifications/services/notification.service';
import { liveUpdateService } from '../../realtime';
import { PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';

// Default workflow step definitions per workflow type
const WORKFLOW_STEPS: Record<ApprovalWorkflowType, Omit<IApprovalStep, 'status' | 'approverId' | 'comments' | 'decidedAt'>[]> = {
  TournamentSanction: [
    { stepNumber: 0, approverRole: 'DISTRICT_ADMIN' },
    { stepNumber: 1, approverRole: 'STATE_ADMIN' },
    { stepNumber: 2, approverRole: 'NATIONAL_ADMIN' },
  ],
  ClubAffiliation: [
    { stepNumber: 0, approverRole: 'DISTRICT_ADMIN' },
    { stepNumber: 1, approverRole: 'STATE_ADMIN' },
  ],
  PlayerTransfer: [
    { stepNumber: 0, approverRole: 'CLUB_MANAGER' },
    { stepNumber: 1, approverRole: 'DISTRICT_ADMIN' },
  ],
  LicenseApproval: [{ stepNumber: 0, approverRole: 'DISTRICT_ADMIN' }],
  OfficialCertification: [
    { stepNumber: 0, approverRole: 'STATE_ADMIN' },
    { stepNumber: 1, approverRole: 'NATIONAL_ADMIN' },
  ],
  PlayerRegistration: [{ stepNumber: 0, approverRole: 'CLUB_MANAGER' }],
};

export class ApprovalWorkflowService {
  constructor(private readonly workflowRepo: ApprovalWorkflowRepository) {}

  async initiateWorkflow(
    type: ApprovalWorkflowType,
    federationId: string,
    entityId: string,
    entityType: string,
    title: string,
    requestedBy: string,
    metadata?: Record<string, unknown>,
    description?: string
  ): Promise<IApprovalWorkflow> {
    await connectDB();

    const stepTemplates = WORKFLOW_STEPS[type];
    const steps: IApprovalStep[] = stepTemplates.map((s) => ({
      ...s,
      status: 'Pending',
    }));

    const workflow = await this.workflowRepo.create({
      type,
      federationId,
      entityId,
      entityType,
      requestedBy,
      title,
      description,
      status: 'Pending',
      steps,
      currentStep: 0,
      metadata,
      createdBy: requestedBy,
    });

    await auditService.logAction({
      actorId: requestedBy,
      action: 'WORKFLOW_INITIATED',
      entityId: workflow.id,
      entityType: 'ApprovalWorkflow',
      metadata: { type, title },
    });

    await liveUpdateService.broadcastAnnouncement(
      `New approval request: ${title}`
    );

    return workflow;
  }

  async processStep(
    workflowId: string,
    stepIndex: number,
    approverId: string,
    decision: 'Approved' | 'Rejected',
    comments?: string
  ): Promise<IApprovalWorkflow | null> {
    await connectDB();

    const updated = await this.workflowRepo.advanceStep(
      workflowId,
      stepIndex,
      approverId,
      decision,
      comments
    );

    if (updated) {
      await auditService.logAction({
        actorId: approverId,
        action: decision === 'Approved' ? 'WORKFLOW_STEP_APPROVED' : 'WORKFLOW_STEP_REJECTED',
        entityId: workflowId,
        entityType: 'ApprovalWorkflow',
        metadata: { stepIndex, comments },
      });

      if (updated.status === 'Approved' || updated.status === 'Rejected') {
        await notificationService.send(
          updated.requestedBy,
          'System',
          `Approval ${updated.status}`,
          `Your request "${updated.title}" has been ${updated.status.toLowerCase()}.`
        );

        await liveUpdateService.broadcastAnnouncement(
          `Approval workflow ${updated.status}: ${updated.title}`
        );
      }
    }

    return updated;
  }

  async getWorkflowsByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IApprovalWorkflow>> {
    await connectDB();
    return this.workflowRepo.findByFederation(federationId, options);
  }

  async getPendingWorkflows(
    federationId: string,
    type?: ApprovalWorkflowType
  ): Promise<IApprovalWorkflow[]> {
    await connectDB();
    return this.workflowRepo.findPending(federationId, type);
  }

  async getWorkflow(id: string): Promise<IApprovalWorkflow | null> {
    await connectDB();
    return this.workflowRepo.findById(id);
  }
}
