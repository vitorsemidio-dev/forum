import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

const editAnswerBodySchema = z.object({
  content: z.string(),
})

export type EditAnswerBody = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
@UseGuards(JwtAuthGuard)
export class EditAnswerController {
  constructor(private readonly editAnswerUseCase: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
    @Body(new ZodValidationPipe(editAnswerBodySchema)) body: EditAnswerBody,
  ) {
    await this.editAnswerUseCase.execute({
      authorId: user.sub,
      attachmentIds: [],
      content: body.content,
      answerId: id,
    })
  }
}
