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

export const BaseSchemaOptions = {
  timestamps: true,
  optimisticConcurrency: true,
  versionKey: 'version'
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
