import mongoose, { Model, ClientSession, UpdateQuery, PipelineStage, AnyBulkWriteOperation } from 'mongoose';

export interface FindAllOptions {
  skip?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  select?: string;
  session?: ClientSession;
  populate?: string | string[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginateOptions extends FindAllOptions {
  page?: number;
}

export class BaseRepository<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(protected readonly model: Model<any>) {}

  protected mapId(doc: Record<string, unknown> | null | undefined): T {
    if (!doc) return doc as any;
    if (doc._id && !doc.id) {
      doc.id = doc._id.toString();
    }
    return doc as T;
  }

  protected mapIds(docs: Record<string, unknown>[]): T[] {
    return docs.map(this.mapId.bind(this));
  }

  // --- Create ---
  async create(data: Partial<T>, options?: { session?: ClientSession }): Promise<T> {
    const documents = await this.model.create([data], { session: options?.session });
    return this.mapId(documents[0].toObject());
  }

  async createMany(data: Partial<T>[], options?: { session?: ClientSession }): Promise<T[]> {
    const documents = await this.model.create(data, { session: options?.session });
    return this.mapIds(documents.map(d => d.toObject()));
  }

  // --- Read ---
  async findById(id: string, options?: Omit<FindAllOptions, 'skip' | 'limit' | 'sort'>): Promise<T | null> {
    let query = this.model.findById(id).where({ isDeleted: false });
    if (options?.select) query = query.select(options.select);
    if (options?.populate) query = query.populate(options.populate as string | string[]);
    if (options?.session) query = query.session(options.session);
    
    // @ts-ignore
    const result = await query.lean().exec();
    return result ? this.mapId(result) : null;
  }

  async findOne(filter: Record<string, unknown>, options?: Omit<FindAllOptions, 'skip' | 'limit' | 'sort'>): Promise<T | null> {
    let query = this.model.findOne({ ...filter, isDeleted: false });
    if (options?.select) query = query.select(options.select);
    if (options?.populate) query = query.populate(options.populate as string | string[]);
    if (options?.session) query = query.session(options.session);
    
    // @ts-ignore
    const result = await query.lean().exec();
    return result ? this.mapId(result) : null;
  }

  async findMany(filter: Record<string, unknown> = {}, options?: FindAllOptions): Promise<T[]> {
    let query = this.model.find({ ...filter, isDeleted: false });
    if (options?.select) query = query.select(options.select);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip) query = query.skip(options.skip);
    if (options?.limit) query = query.limit(options.limit);
    if (options?.populate) query = query.populate(options.populate as string | string[]);
    if (options?.session) query = query.session(options.session);
    
    // @ts-ignore
    const results = await query.lean().exec();
    return this.mapIds(results);
  }
  
  // alias for findMany
  async findAll(filter: Record<string, unknown> = {}, options?: FindAllOptions): Promise<T[]> {
      return this.findMany(filter, options);
  }

  async exists(filter: Record<string, unknown>, session?: ClientSession): Promise<boolean> {
    const result = await this.model.exists({ ...filter, isDeleted: false }).session(session || null);
    return result !== null;
  }

  async count(filter: Record<string, unknown> = {}, session?: ClientSession): Promise<number> {
    return this.model.countDocuments({ ...filter, isDeleted: false }).session(session || null).exec();
  }

  // --- Update ---
  async update(id: string, data: UpdateQuery<T>, options?: { session?: ClientSession }): Promise<T | null> {
    const result = await this.model.findByIdAndUpdate(
      id,
      data,
      { new: true, session: options?.session, runValidators: true }
    ).where({ isDeleted: false }).lean().exec();
    return result ? this.mapId(result) : null;
  }

  async updateMany(filter: Record<string, unknown>, data: UpdateQuery<T>, options?: { session?: ClientSession }): Promise<number> {
    const result = await this.model.updateMany(
      { ...filter, isDeleted: false },
      data,
      { session: options?.session, runValidators: true }
    ).exec();
    return result.modifiedCount;
  }

  // --- Delete & Restore ---
  async delete(id: string, options?: { session?: ClientSession }): Promise<boolean> {
    // Soft delete
    const result = await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { session: options?.session }
    ).exec();
    return !!result;
  }

  async restore(id: string, options?: { session?: ClientSession }): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      id,
      { isDeleted: false, $unset: { deletedAt: 1 } },
      { session: options?.session }
    ).exec();
    return !!result;
  }

  // --- Advanced Queries ---
  async paginate(filter: Record<string, unknown> = {}, options: PaginateOptions = {}): Promise<PaginatedResult<T>> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.findMany(filter, { ...options, skip, limit }),
      this.count(filter, options.session)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages
    };
  }

  async search(query: string, searchFields: string[], filter: Record<string, unknown> = {}, options?: PaginateOptions): Promise<PaginatedResult<T>> {
    if (!query || query.trim() === '') {
      return this.paginate(filter, options);
    }
    
    // Create regex OR condition for search fields
    const searchConditions = searchFields.map(field => ({
      [field]: { $regex: query, $options: 'i' }
    }));
    
    const searchFilter = {
      ...filter,
      $or: searchConditions
    };
    
    return this.paginate(searchFilter, options);
  }

  async aggregate(pipeline: PipelineStage[], session?: ClientSession): Promise<unknown[]> {
    return this.model.aggregate(pipeline).session(session || null).exec();
  }

  async bulkWrite(operations: AnyBulkWriteOperation[], options?: { session?: ClientSession }) {
    return this.model.bulkWrite(operations, { session: options?.session });
  }

  // --- Transactions ---
  async withTransaction<R>(fn: (session: ClientSession) => Promise<R>): Promise<R> {
    const session = await this.model.db.startSession();
    try {
      session.startTransaction();
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
