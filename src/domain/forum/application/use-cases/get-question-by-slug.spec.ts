import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { makeInMemoryQuestionRepository } from 'test/factories/make-in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

const makeSut = () => {
  const inMemoryQuestionsRepository = makeInMemoryQuestionRepository()
  const sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  return { sut, inMemoryQuestionsRepository }
}

describe('GetQuestionBySlug', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: GetQuestionBySlugUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryQuestionsRepository = dependencies.inMemoryQuestionsRepository
    sut = dependencies.sut
  })

  it('should get a question by slug', async () => {
    const newQuestion = makeQuestion({
      title: 'Existing Question',
      slug: Slug.create('existing-question'),
    })
    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'existing-question',
    })

    expect(result.isRight()).toBe(true)
    const { question } = result.value as { question: Question }
    expect(question.title).toBe('Existing Question')
    expect(question.slug.value).toBe('existing-question')
  })
})
