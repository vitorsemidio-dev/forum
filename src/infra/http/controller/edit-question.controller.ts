import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

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
    await this.editQuestionUseCase.execute({
      authorId: user.sub,
      attachmentIds: body.attachments,
      content: body.content,
      questionId: id,
      title: body.title,
    })
  }
}
