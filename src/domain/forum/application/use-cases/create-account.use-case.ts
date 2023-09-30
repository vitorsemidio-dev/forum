import { Either, left, right } from '@/core/either'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exist.error'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-user.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

interface CreateAccountCaseRequest {
  email: string
  name: string
  password: string
}

type CreateAccountCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashGenerator: HashGenerator,
  ) {}
  async execute({
    name,
    email,
    password,
  }: CreateAccountCaseRequest): Promise<CreateAccountCaseResponse> {
    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (userAlreadyExists) {
      return left(new StudentAlreadyExistsError(email))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: passwordHash,
    })

    await this.prismaService.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })

    return right({
      student,
    })
  }
}
