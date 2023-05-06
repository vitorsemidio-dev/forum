import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {},
}

test('create an answer', async ({ expect }) => {
  const answerQuestionUseCase = new AnswerQuestionUseCase(fakeAnswersRepository)

  const { answer } = await answerQuestionUseCase.execute({
    instructorId: 'any_instructor_id',
    questionId: 'any_question_id',
    content: 'any_content',
  })

  expect(answer.id.toValue()).toBeTruthy()
  expect(answer.content).toBe('any_content')
})
