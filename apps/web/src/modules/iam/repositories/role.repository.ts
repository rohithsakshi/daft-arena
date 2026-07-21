import { BaseRepository } from './BaseRepository';
import { RoleModel, IRole } from '../models/Role';
import { ClientSession } from 'mongoose';

export class RoleRepository extends BaseRepository<IRole> {
  constructor() {
    super(RoleModel);
  }

  async findByCode(code: string, session?: ClientSession): Promise<IRole | null> {
    return this.findOne({ code }, { session });
  }
  
  async findByIdWithPermissions(id: string, session?: ClientSession): Promise<IRole | null> {
    return this.model.findById(id)
      .where({ isDeleted: false })
      .populate('permissions')
      .populate('parentRoleId')
      .session(session || null)
      .lean().exec() as Promise<IRole | null>;
  }
  
  async findAllWithPermissions(session?: ClientSession): Promise<IRole[]> {
    return this.model.find({ isDeleted: false })
      .populate('permissions')
      .session(session || null)
      .lean().exec() as Promise<IRole[]>;
  }
}
