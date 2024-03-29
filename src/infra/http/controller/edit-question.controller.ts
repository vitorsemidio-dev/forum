import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { z } from 'zod'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})

export type EditQuestionBody = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestionUseCase: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
    @Body(new ZodValidationPipe(editQuestionBodySchema)) body: EditQuestionBody,
  ) {
    const result = await this.editQuestionUseCase.execute({
      authorId: user.sub,
      attachmentIds: body.attachments,
      content: body.content,
      questionId: id,
      title: body.title,
    })

    if (result.isLeft()) {
      throw result.value
    }
  }
}
