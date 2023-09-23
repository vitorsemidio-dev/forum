import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>

@Controller('/answer-question/:questionId')
@UseGuards(JwtAuthGuard)
export class AnswerQuestionController {
  constructor(private readonly answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(answerQuestionBodySchema))
    body: AnswerQuestionBody,
    @CurrentUser() user: TokenPayload,
  ) {
    const { content } = body

    await this.answerQuestionUseCase.execute({
      instructorId: user.sub,
      content,
      attachmentIds: [],
      questionId: questionId,
    })
  }
}