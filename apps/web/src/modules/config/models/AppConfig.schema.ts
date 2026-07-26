import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IAppConfig extends IBaseDocument {
  key: string;
  value: any;
  description?: string;
}

const AppConfigSchema = createBaseSchema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String }
});

export const AppConfigModel: Model<IAppConfig> = mongoose.models.AppConfig || mongoose.model<IAppConfig>('AppConfig', AppConfigSchema);
