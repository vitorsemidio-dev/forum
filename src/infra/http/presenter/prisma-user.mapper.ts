import { Student } from '@/domain/forum/enterprise/entities/student'
import { Prisma } from '@prisma/client'

export class PrismaStudentMapper {
  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
