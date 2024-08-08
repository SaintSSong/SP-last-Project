import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';
import { Preferences } from './entities/preferences.entity';
import { User } from '../users/entities/user.entity';
import { MatchingModule } from '../matchings/matching.module';

@Module({
  imports: [TypeOrmModule.forFeature([Preferences, User]), MatchingModule],
  controllers: [PreferenceController],
  providers: [PreferenceService],
})
export class PreferenceModule {}
