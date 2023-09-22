import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { fakerPtBr } from 'test/utils/faker'

export function makeUser(
  override: Partial<Omit<User, 'id'>> = {},
  id?: string,
): User | Omit<User, 'id'> {
  return {
    id: id,
    name: fakerPtBr.name.fullName(),
    email: fakerPtBr.internet.email(),
    password: fakerPtBr.internet.password(),
    ...override,
  }
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makeUser(override: Partial<Omit<User, 'id'>> = {}): Promise<User> {
    return this.prisma.user.create({
      data: makeUser(override),
    })
  }
}
