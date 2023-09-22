import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common'

@Controller('/questions/:id')
@UseGuards(JwtAuthGuard)
export class DeleteQuestionController {
  constructor(private readonly deletequestionUseCase: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    await this.deletequestionUseCase.execute({
      questionId: id,
      authorId: user.sub,
    })
  }
}
