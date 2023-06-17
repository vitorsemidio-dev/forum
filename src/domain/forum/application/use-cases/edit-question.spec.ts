import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed.error'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should edit a question', async () => {
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
      title: 'new title updated',
      content: 'new content updated',
      attachmentIds: [],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'new title updated',
      content: 'new content updated',
    })
  })

  it('should not edit a question from another user', async () => {
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
      title: 'new title updated',
      content: 'new content updated',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError('Not allowed.'))
  })
})
