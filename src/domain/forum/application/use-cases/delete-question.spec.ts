import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed.error'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('DeleteQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should delete a question', async () => {
    const newQuestion1 = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-id-1'),
    )
    const newQuestion2 = makeQuestion({}, new UniqueEntityId('question-id-2'))
    await inMemoryQuestionsRepository.create(newQuestion1)
    await inMemoryQuestionsRepository.create(newQuestion2)

    const result = await sut.execute({
      questionId: 'question-id-1',
      authorId: 'author-id-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items.length).toBe(1)
  })

  it('should not delete a question from another user', async () => {
    const newQuestion1 = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-id-1'),
    )
    const newQuestion2 = makeQuestion({}, new UniqueEntityId('question-id-2'))
    await inMemoryQuestionsRepository.create(newQuestion1)
    await inMemoryQuestionsRepository.create(newQuestion2)

    const result = await sut.execute({
      questionId: 'question-id-1',
      authorId: 'author-id-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError('Not allowed.'))
    expect(inMemoryQuestionsRepository.items.length).toBe(2)
  })
})
