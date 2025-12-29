import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './datasource';

export const TypeOrmRootModule = TypeOrmModule.forRoot({
  ...AppDataSource.options,
  autoLoadEntities: true,
});
