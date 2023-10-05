import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { makeInMemoryQuestionRepositoryWithDependencies } from 'test/factories/make-in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-student.repository'

const makeSut = () => {
  const {
    inMemoryQuestionsRepository,
    inMemoryAttachmentsRepository,
    inMemoryQuestionAttachmentsRepository,
    inMemoryStudentsRepository,
  } = makeInMemoryQuestionRepositoryWithDependencies()
  const sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  return {
    sut,
    inMemoryQuestionsRepository,
    inMemoryAttachmentsRepository,
    inMemoryQuestionAttachmentsRepository,
    inMemoryStudentsRepository,
  }
}

describe('GetQuestionBySlug', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: GetQuestionBySlugUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryQuestionsRepository = dependencies.inMemoryQuestionsRepository
    inMemoryStudentsRepository = dependencies.inMemoryStudentsRepository
    sut = dependencies.sut
  })

  it('should get a question by slug', async () => {
    const student = makeStudent({ name: 'John Doe' })
    await inMemoryStudentsRepository.create(student)
    const newQuestion = makeQuestion({
      authorId: student.id,
      title: 'Existing Question',
      slug: Slug.create('existing-question'),
    })
    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'existing-question',
    })

    expect(result.isRight()).toBe(true)
    const { question } = result.value as { question: QuestionDetails }
    expect(question.title).toBe('Existing Question')
    expect(question.slug.value).toBe('existing-question')
  })
})
