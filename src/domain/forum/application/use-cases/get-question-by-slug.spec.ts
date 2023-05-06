import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/in-memory-questions-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('GetQuestionBySlug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should get a question by slug', async () => {
    const newQuestion = makeQuestion({
      title: 'Existing Question',
      slug: Slug.create('existing-question'),
    })
    await inMemoryQuestionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'existing-question',
    })

    expect(question).toBeTruthy()
    expect(question.title).toBe('Existing Question')
    expect(question.slug.value).toBe('existing-question')
  })
})
