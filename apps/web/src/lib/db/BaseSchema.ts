import { Schema, Document } from 'mongoose';

export interface IBaseDocument extends Omit<Document, 'id'> {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  version: number;
}

const transformOptions = {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
};

export const BaseSchemaOptions = {
  timestamps: true,
  optimisticConcurrency: true,
  versionKey: 'version',
  toJSON: transformOptions,
  toObject: transformOptions
};

export const createBaseSchema = (schemaDefinition: any, options = {}) => {
  const schema = new Schema(
    {
      ...schemaDefinition,
      createdBy: { type: String, required: false },
      updatedBy: { type: String, required: false },
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: { type: Date, required: false }
    },
    { ...BaseSchemaOptions, ...options }
  );

  return schema;
};
