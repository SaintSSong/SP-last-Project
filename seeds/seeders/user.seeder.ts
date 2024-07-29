// import { User } from '../../src/users/entities/user.entity';
// import { DataSource } from 'typeorm';
// import { Seeder, SeederFactoryManager } from 'typeorm-extension';

// export default class UserSeeder implements Seeder {
//   public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
//     const userRepository = dataSource.getRepository(User);
//     const numUsers = await userRepository.count();

//     const userFactory = factoryManager.get(User);
//     const numNewUsers = 10;
//     const newUsers = await userFactory.saveMany(numNewUsers);

//     for (const newUser of newUsers) {
//       newUser.accountId = newUser.id;
//       await userFactory.save(newUser);
//     }
//   }
// }

import { Gender } from 'src/users/types/Gender.type';
import { User } from '../../src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Frequency } from 'src/users/types/frequency.type';
import { Religion } from 'src/users/types/religion.type';
import { Region } from 'src/users/types/region.type';
import { Mbti } from 'src/users/types/mbti.type';
import { BodyShape } from 'src/users/types/bodyshape.type';
import { Pet } from 'src/users/types/pet.type';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save([
      {
        accountId: 1,
        birthDate: '1991-01-01',
        gender: Gender.MALE,
        nickname: 'Alpha',
        smokingFreq: Frequency.FREQUENTLY,
        drinkingFreq: Frequency.SOMETIMES,
        religion: Religion.NONE,
        region: Region.BUSAN,
        mbti: Mbti.ENFJ,
        height: 176.8,
        bodyShape: BodyShape.DEVELOPER,
        pet: Pet.CAT,
        bio: '안녕하세요.',
      },
      {
        accountId: 2,
        birthDate: '1992-01-01',
        gender: Gender.MALE,
        nickname: 'Bravo',
        smokingFreq: Frequency.FREQUENTLY,
        drinkingFreq: Frequency.SOMETIMES,
        religion: Religion.NONE,
        region: Region.BUSAN,
        mbti: Mbti.ENFJ,
        height: 176.8,
        bodyShape: BodyShape.CHUBBY,
        pet: Pet.ETC,
        bio: '안녕하세요.',
      },
      {
        accountId: 3,
        birthDate: '1993-01-01',
        gender: Gender.MALE,
        nickname: 'Charlie',
        smokingFreq: Frequency.NEVER,
        drinkingFreq: Frequency.FREQUENTLY,
        religion: Religion.ETC,
        region: Region.GANGWON,
        mbti: Mbti.ENTJ,
        height: 177.5,
        bodyShape: BodyShape.MUSCULAR,
        pet: Pet.DOG,
        bio: '안녕하세요.',
      },
      {
        accountId: 4,
        birthDate: '1994-01-01',
        gender: Gender.FEMALE,
        nickname: 'Delta',
        smokingFreq: Frequency.NEVER,
        drinkingFreq: Frequency.SOMETIMES,
        religion: Religion.NONE,
        region: Region.DAEGU,
        mbti: Mbti.ISFP,
        height: 165.4,
        bodyShape: BodyShape.NORMAL,
        pet: Pet.CAT,
        bio: '안녕하세요.',
      },
      {
        accountId: 5,
        birthDate: '1995-01-01',
        gender: Gender.MALE,
        nickname: 'Eco',
        smokingFreq: Frequency.FREQUENTLY,
        drinkingFreq: Frequency.NEVER,
        religion: Religion.CHRISTIAN,
        region: Region.SEJONG,
        mbti: Mbti.INFP,
        height: 179.5,
        bodyShape: BodyShape.SLIM,
        pet: Pet.NONE,
        bio: '안녕하세요.',
      },
    ]);
  }
}
