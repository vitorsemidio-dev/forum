import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashGenerator: HashGenerator,
  ) {}

  @Post('')
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @HttpCode(201)
  async handle(@Body() body: CreateAccountBodySchema) {
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
