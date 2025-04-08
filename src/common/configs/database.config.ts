import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppDataSource } from '@app/common/configs/orm.config';

const config: TypeOrmModuleOptions = {
  ...AppDataSource.options,
  autoLoadEntities: true,
};

export default registerAs('database', () => config);
export type DatabaseConfigType = typeof config;
