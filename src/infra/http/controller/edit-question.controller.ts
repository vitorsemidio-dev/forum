import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

export type EditQuestionBody = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
@UseGuards(JwtAuthGuard)
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
      attachmentIds: [],
      content: body.content,
      questionId: id,
      title: body.title,
    })
  }
}
