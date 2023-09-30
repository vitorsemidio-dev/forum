import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private readonly deletequestionUseCase: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    const result = await this.deletequestionUseCase.execute({
      questionId: id,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      throw result.value
    }
  }
}
