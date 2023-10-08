import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaStudentMapper {
  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }

  static toDomain(user: PrismaUser): Student {
    return Student.create(
      {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      new UniqueEntityId(user.id),
    )
  }
}
