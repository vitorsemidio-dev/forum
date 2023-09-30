import { Either, left, right } from '@/core/either'
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials.error'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

interface AuthenticateCaseRequest {
  email: string
  password: string
}

type AuthenticateCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly hashComparer: HashComparer,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateCaseRequest): Promise<AuthenticateCaseResponse> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialsError())
    }

    const accessToken = this.jwtService.sign({ sub: user.id })
    return right({
      accessToken,
    })
  }
}
