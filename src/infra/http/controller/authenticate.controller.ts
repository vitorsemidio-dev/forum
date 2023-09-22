import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'

const authenticationBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticationBodySchema = z.infer<typeof authenticationBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private hashComparer: HashComparer,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticationBodySchema))
  async handle(@Body() body: AuthenticationBodySchema) {
    const { email, password } = body

    const user = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = this.jwtService.sign({ sub: user.id })
    return {
      access_token: accessToken,
    }
  }
}
