import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { AppModule } from '../src/app.module';
import AccountSeeder from './seeders/account.seeder';
import UserSeeder from './seeders/user.seeder';
import { userFactory } from './factories/user.factory';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from 'src/users/entities/user.entity';
import { UserToInterest } from 'src/users/entities/user-to-interest.entity';
import { UserToTech } from 'src/users/entities/user-to-tech.entity';
import { Tech } from 'src/users/entities/tech.entity';
import { Interest } from 'src/users/entities/interest.entity';
import { ProfileImage } from 'src/users/entities/profile-image.entity';
import { Account } from 'src/auth/entities/account.entity';
import { ChatMessage } from 'src/chat-rooms/entities/chat-message.entity';
import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';
import { Heart } from 'src/matchings/entities/heart.entity';
import { Matching } from 'src/matchings/entities/matching.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { accountFactory } from './factories/account.factory';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  const options: DataSourceOptions & SeederOptions = {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    synchronize: configService.get<boolean>('DB_SYNC'),
    namingStrategy: new SnakeNamingStrategy(),
    entities: [
      Account,
      User,
      UserToInterest,
      UserToTech,
      Interest,
      Tech,
      ProfileImage,
      ChatMessage,
      ChatRoom,
      Heart,
      Matching,
      Notification,
    ],
    seeds: [AccountSeeder, UserSeeder],
    factories: [accountFactory, userFactory],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  // Run seeders in order
  await runSeeders(dataSource, { seeds: [AccountSeeder, UserSeeder] });
  console.log('Seeding completed');
  await app.close();
  process.exit();
})();
