import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { Public } from '@/infra/auth/public'
import { AnswerPresenter } from '@/infra/http/presenters/answer.presenter'
import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common'
import { z } from 'zod'

const fetchAnswersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
})

type FetchAnswersQuery = z.infer<typeof fetchAnswersQuerySchema>

@Controller('/questions/:questionId/answers')
@Public()
export class FetchQuestionAnswersController {
  constructor(
    private readonly fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('questionId') questionId: string,
    @Query() query: FetchAnswersQuery,
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({
      questionId,
      page: query.page || 1,
    })

    if (result.isLeft()) {
      throw new Error('Unexpected error')
    }

    const answers = result.value.answers

    return answers.map(AnswerPresenter.toHTTP)
  }
}
