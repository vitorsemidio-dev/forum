import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common'

@Controller('/answers/:id')
@UseGuards(JwtAuthGuard)
export class DeleteAnswerController {
  constructor(private readonly deleteanswerUseCase: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    await this.deleteanswerUseCase.execute({
      answerId: id,
      authorId: user.sub,
    })
  }
}
