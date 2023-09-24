import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-user.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { fakerPtBr } from 'test/utils/faker'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityId,
): Student {
  const student = Student.create(
    {
      name: fakerPtBr.name.fullName(),
      email: fakerPtBr.internet.email(),
      password: fakerPtBr.internet.password(),
      ...override,
    },
    id,
  )

  return student
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makeStudent(override: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(override)

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })

    return student
  }

  async makeManyStudent(
    quantity: number,
    override: Partial<StudentProps> = {},
  ): Promise<Student[]> {
    const students = Array.from({ length: quantity }).map(() =>
      makeStudent(override),
    )

    await this.prisma.user.createMany({
      data: students.map((student) => PrismaStudentMapper.toPrisma(student)),
    })

    return students
  }
}
