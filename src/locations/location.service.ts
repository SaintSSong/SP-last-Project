import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { User } from '../users/entities/user.entity';
import { UserService } from 'src/users/user.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userService: UserService,
  ) {}

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number | null {
    if (lat1 && lon1 && lat2 && lon2) {
      const R = 6371; // 지구의 반지름 (단위: km)
      const dLat = this.toRadians(lat2 - lat1);
      const dLon = this.toRadians(lon1 - lon2);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // 두 지점 간의 거리 (단위: km)
    } else {
      return null;
    }
  }

  async updateLocation(userId: number, latitude: number, longitude: number): Promise<boolean> {
    await this.userService.validateUserExists(userId);

    // 기존 위치 정보가 있는지 확인
    let location = await this.getLocationByUserId(userId);

    if (location) {
      // 기존 위치 정보 업데이트
      location.latitude = latitude;
      location.longitude = longitude;
      await this.locationRepository.update({ userId }, { latitude, longitude });
    } else {
      // 새로운 위치 정보 생성 및 저장
      location = this.locationRepository.create({ userId, latitude, longitude });
      await this.locationRepository.save(location);
    }

    return true;
  }

  async getLocationByUserId(userId: number): Promise<Location> {
    return this.locationRepository.findOne({ where: { userId } });
  }
}
