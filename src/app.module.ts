import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ActivityPointsModule } from './ActivityPoints/ActivityPoints.module';
import { ActivityPoints } from './ActivityPoints/ActivityPoints.entity';

const defaultValues = {
  username: 'postgres',
  host: 'db',
  dbname: 'postgres',
  password: 'postgres',
  port: 5432,
};

let {
  username = defaultValues.username,
  host = defaultValues.host,
  dbname = defaultValues.dbname,
  password = defaultValues.password,
  port = defaultValues.port,
} = {} as any;

try {
  const dbSecret: Partial<typeof defaultValues> = JSON.parse(
    process.env.DB_SECRET || '{}',
  );
  ({
    username = defaultValues.username,
    host = defaultValues.host,
    dbname = defaultValues.dbname,
    password = defaultValues.password,
    port = defaultValues.port,
  } = dbSecret);
} catch (error) {
  console.error('Error parsing DB_SECRET:', (error as Error).message);
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: port,
      username: username,
      password: password,
      database: dbname,
      entities: [ActivityPoints],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ActivityPointsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
