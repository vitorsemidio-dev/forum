import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

@Controller('/accounts')
export class CreateAccountController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashGenerator: HashGenerator,
  ) {}

  @Post('')
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (userAlreadyExists) {
      throw new ConflictException(`User with email "${email}" already exists`)
    }

    const passwordHash = await this.hashGenerator.hash(password)

    await this.prismaService.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    })
  }
}
