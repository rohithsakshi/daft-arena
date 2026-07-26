import { BaseRepository } from '../../../lib/db/BaseRepository';
import { AppConfigModel, IAppConfig } from '../models/AppConfig.schema';

export class AppConfigRepository extends BaseRepository<IAppConfig> {
  constructor() {
    super(AppConfigModel);
  }

  async getValue(key: string, defaultValue?: any) {
    const config = await this.model.findOne({ key }).lean() as IAppConfig | null;
    return config ? config.value : defaultValue;
  }
}

export const configRepo = new AppConfigRepository();
