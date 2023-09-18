import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { TokenPayload } from '../../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBody,
    @CurrentUser() user: TokenPayload,
  ) {
    const { title, content } = body

    await this.prismaService.question.create({
      data: {
        authorId: user.sub,
        content,
        slug: Slug.createFromText(title).value,
        title,
      },
    })
  }
}
