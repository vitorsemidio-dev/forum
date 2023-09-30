import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Param, Post } from '@nestjs/common'
import { z } from 'zod'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string()).default([]),
})

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>

@Controller('/answer-question/:questionId')
export class AnswerQuestionController {
  constructor(private readonly answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(answerQuestionBodySchema))
    body: AnswerQuestionBody,
    @CurrentUser() user: TokenPayload,
  ) {
    const { attachments, content } = body

    const result = await this.answerQuestionUseCase.execute({
      authorId: user.sub,
      content,
      attachmentIds: attachments,
      questionId: questionId,
    })

    if (result.isLeft()) {
      throw result.value
    }
  }
}
