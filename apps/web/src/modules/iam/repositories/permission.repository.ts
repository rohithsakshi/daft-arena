import { BaseRepository } from '../../../lib/db/BaseRepository';
import { PermissionModel, IPermission } from '../models/Permission';
import { PermissionGroupModel, IPermissionGroup } from '../models/PermissionGroup';
import { ClientSession } from 'mongoose';

export class PermissionRepository extends BaseRepository<IPermission> {
  constructor() {
    super(PermissionModel);
  }

  async findPermissionByCode(code: string, session?: ClientSession): Promise<IPermission | null> {
    return this.findOne({ code }, { session });
  }

  async findAllPermissions(session?: ClientSession): Promise<IPermission[]> {
    return this.model.find({ isDeleted: false })
      .populate('permissionGroupId')
      .session(session || null)
      .lean().exec() as Promise<IPermission[]>;
  }

  async createPermissionGroup(data: Partial<IPermissionGroup>, options?: { session?: ClientSession }): Promise<IPermissionGroup> {
    const docs = await PermissionGroupModel.create([data], { session: options?.session });
    return docs[0].toObject();
  }
  
  async findAllPermissionGroups(session?: ClientSession): Promise<IPermissionGroup[]> {
    return PermissionGroupModel.find({ isDeleted: false })
      .session(session || null)
      .lean().exec();
  }
}
