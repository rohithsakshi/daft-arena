import mongoose, { Model, Document, ClientSession } from 'mongoose';

export interface FindAllOptions {
  skip?: number;
  limit?: number;
  sort?: any;
  select?: string;
  session?: ClientSession;
}

export class BaseRepository<T> {
  constructor(protected readonly model: Model<any>) {}

  protected mapId(doc: any): T {
    if (!doc) return doc;
    if (doc._id) {
      doc.id = doc._id.toString();
    }
    return doc as T;
  }

  protected mapIds(docs: any[]): T[] {
    return docs.map(this.mapId.bind(this));
  }

  async findById(id: string, options?: { session?: ClientSession, select?: string }): Promise<T | null> {
    let query = this.model.findById(id).where({ isDeleted: false });
    if (options?.select) query = query.select(options.select);
    if (options?.session) query = query.session(options.session);
    // @ts-ignore
    const result = await query.lean().exec();
    return result ? this.mapId(result) : null;
  }

  async findOne(filter: Record<string, any>, options?: { session?: ClientSession, select?: string }): Promise<T | null> {
    let query = this.model.findOne({ ...filter, isDeleted: false });
    if (options?.select) query = query.select(options.select);
    if (options?.session) query = query.session(options.session);
    // @ts-ignore
    const result = await query.lean().exec();
    return result ? this.mapId(result) : null;
  }

  async findAll(filter: Record<string, any> = {}, options?: FindAllOptions): Promise<T[]> {
    let query = this.model.find({ ...filter, isDeleted: false });
    if (options?.select) query = query.select(options.select);
    if (options?.sort) query = query.sort(options.sort);
    if (options?.skip) query = query.skip(options.skip);
    if (options?.limit) query = query.limit(options.limit);
    if (options?.session) query = query.session(options.session);
    // @ts-ignore
    const results = await query.lean().exec();
    return this.mapIds(results);
  }

  async create(data: Partial<T>, options?: { session?: ClientSession }): Promise<T> {
    const documents = await this.model.create([data], { session: options?.session });
    return this.mapId(documents[0].toObject());
  }

  async update(id: string, data: Record<string, any>, options?: { session?: ClientSession }): Promise<T | null> {
    const result = await this.model.findByIdAndUpdate(
      id,
      data,
      { new: true, session: options?.session, runValidators: true }
    ).where({ isDeleted: false }).lean().exec();
    return result ? this.mapId(result) : null;
  }

  async softDelete(id: string, options?: { session?: ClientSession }): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { session: options?.session }
    ).exec();
    return !!result;
  }
}
