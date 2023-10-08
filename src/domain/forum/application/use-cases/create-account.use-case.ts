import { Either, left, right } from '@/core/either'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { StudentsRepository } from '@/domain/forum/application/repositories/student.repository'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exist.error'
import { Student } from '@/domain/forum/enterprise/entities/student'
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
    private readonly studentsRepository: StudentsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}
  async execute({
    name,
    email,
    password,
  }: CreateAccountCaseRequest): Promise<CreateAccountCaseResponse> {
    const userAlreadyExists = await this.studentsRepository.findByEmail(email)

    if (userAlreadyExists) {
      return left(new StudentAlreadyExistsError(email))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: passwordHash,
    })

    await this.studentsRepository.create(student)

    return right({
      student,
    })
  }
}
