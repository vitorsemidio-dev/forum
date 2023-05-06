import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('create a question', async () => {
    const { question } = await sut.execute({
      authorId: 'any_author_id',
      content: 'any_content',
      title: 'any_title',
    })

    expect(question.id.toValue()).toBeTruthy()
    expect(question.authorId.toValue()).toBe('any_author_id')
    expect(question.content).toBe('any_content')
    expect(question.title).toBe('any_title')
    expect(inMemoryQuestionsRepository.items[0].id.toValue()).toBe(
      question.id.toValue(),
    )
  })
})
