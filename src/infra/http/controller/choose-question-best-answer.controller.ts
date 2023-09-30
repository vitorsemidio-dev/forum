import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { TokenPayload } from '@/infra/auth/jwt.strategy'
import { Controller, HttpCode, Param, Patch } from '@nestjs/common'

@Controller('/answers/:answerId/choose-as-best-answer')
export class ChooseQuestionBestAnswerController {
  constructor(
    private readonly chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayload,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.chooseQuestionBestAnswerUseCase.execute({
      answerId,
      authorId: user.sub,
    })

    if (result.isLeft()) {
      throw result.value
    }
  }
}
