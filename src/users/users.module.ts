import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserToInterest } from './entities/user-to-interest.entity';
import { UserToTech } from './entities/user-to-tech.entity';
import { Interest } from '../interests/entities/interest.entity';
import { Tech } from '../techs/entities/tech.entity';
import { ProfileImage } from '../images/entities/profile-image.entity';
import { Interest } from '../interest/entities/interest.entity';
import { Tech } from '../tech/entities/tech.entity';
import { ProfileImage } from '../images/entities/profile-image.entity';
import { Matching } from '../matchings/entities/matching.entity';
import { Heart } from '../matchings/entities/heart.entity';
import { ChatRoom } from '../chat-rooms/entities/chat-room.entity';
import { ChatMessage } from '../chat-rooms/entities/chat-message.entity';
import { Account } from '../auth/entities/account.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { S3Module } from 'src/s3/s3.module';
import { MatchingPreferences } from 'src/matchings/entities/matching-preferences.entity';
import { Location } from 'src/locations/entities/location.entity';

@Module({
  imports: [
    S3Module,
    TypeOrmModule.forFeature([
      User,
      UserToInterest,
      UserToTech,
      Interest,
      Tech,
      ProfileImage,
      Notification,
      Matching,
      Heart,
      ChatRoom,
      ChatMessage,
      Account,
      MatchingPreferences,
      Location,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, TypeOrmModule],
})
export class UsersModule {}
