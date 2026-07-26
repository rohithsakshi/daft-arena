import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { ApprovalWorkflowModel, IApprovalWorkflow, ApprovalWorkflowType, WorkflowStatus } from '../models/ApprovalWorkflow';

export class ApprovalWorkflowRepository extends BaseRepository<IApprovalWorkflow> {
  constructor() {
    super(ApprovalWorkflowModel);
  }

  async findByFederation(
    federationId: string,
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IApprovalWorkflow>> {
    return this.paginate({ federationId }, { ...options, sort: { createdAt: -1 } });
  }

  async findByEntity(entityId: string, entityType: string): Promise<IApprovalWorkflow[]> {
    return this.findMany({ entityId, entityType });
  }

  async findPending(
    federationId: string,
    type?: ApprovalWorkflowType
  ): Promise<IApprovalWorkflow[]> {
    const filter: Record<string, unknown> = {
      federationId,
      status: { $in: ['Pending', 'InProgress'] },
    };
    if (type) filter.type = type;
    return this.findMany(filter, { sort: { createdAt: 1 } });
  }

  async advanceStep(
    id: string,
    stepIndex: number,
    approverId: string,
    decision: 'Approved' | 'Rejected',
    comments?: string
  ): Promise<IApprovalWorkflow | null> {
    const workflow = await this.findById(id);
    if (!workflow) return null;

    const steps = [...workflow.steps];
    steps[stepIndex] = {
      ...steps[stepIndex],
      approverId,
      status: decision,
      comments,
      decidedAt: new Date(),
    };

    const allApproved = steps.every((s) => s.status === 'Approved');
    const anyRejected = steps.some((s) => s.status === 'Rejected');
    const nextStep = stepIndex + 1;
    const hasNextStep = nextStep < steps.length;

    const newStatus: WorkflowStatus = anyRejected
      ? 'Rejected'
      : allApproved
      ? 'Approved'
      : hasNextStep
      ? 'InProgress'
      : 'Approved';

    return this.update(id, {
      $set: {
        steps,
        currentStep: hasNextStep && !anyRejected ? nextStep : stepIndex,
        status: newStatus,
        ...(newStatus === 'Approved' || newStatus === 'Rejected'
          ? { completedAt: new Date() }
          : {}),
      },
    });
  }
}
