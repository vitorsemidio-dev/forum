import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { Question } from '@/domain/forum/enterprise/entities/question'

const fakeQuestionsRepository: QuestionsRepository = {
  create: async (question: Question) => {},
}

test('create a question', async ({ expect }) => {
  const questionQuestionUseCase = new CreateQuestionUseCase(
    fakeQuestionsRepository,
  )

  const { question } = await questionQuestionUseCase.execute({
    authorId: 'any_author_id',
    content: 'any_content',
    title: 'any_title',
  })

  expect(question.id.toValue()).toBeTruthy()
  expect(question.authorId.toValue()).toBe('any_author_id')
  expect(question.content).toBe('any_content')
  expect(question.title).toBe('any_title')
})
