import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

const makeSut = () => {
  const inMemoryAnswerAttachmentsRepository =
    new InMemoryAnswerAttachmentsRepository()
  const inMemoryAnswersRepository = new InMemoryAnswersRepository(
    inMemoryAnswerAttachmentsRepository,
  )
  const sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  return { sut, inMemoryAnswerAttachmentsRepository, inMemoryAnswersRepository }
}

describe('DeleteAnswerUseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: DeleteAnswerUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryAnswersRepository = dependencies.inMemoryAnswersRepository
    inMemoryAnswerAttachmentsRepository =
      dependencies.inMemoryAnswerAttachmentsRepository
    sut = dependencies.sut
  })

  it('should delete a answer', async () => {
    const newAnswer1 = makeAnswer(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('answer-id-1'),
    )
    const newAnswer2 = makeAnswer({}, new UniqueEntityId('answer-id-2'))
    await inMemoryAnswersRepository.create(newAnswer1)
    await inMemoryAnswersRepository.create(newAnswer2)

    const result = await sut.execute({
      answerId: 'answer-id-1',
      authorId: 'author-id-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items.length).toBe(1)
  })

  it('should delete a answer with attachments', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('answer-id-1'),
    )
    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('attachment-id-1'),
        answerId: newAnswer.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('attachment-id-2'),
        answerId: newAnswer.id,
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-id-1',
      authorId: 'author-id-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items.length).toBe(0)
    expect(inMemoryAnswerAttachmentsRepository.items.length).toBe(0)
  })

  it('should not delete a answer from another user', async () => {
    const newAnswer1 = makeAnswer(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('answer-id-1'),
    )
    const newAnswer2 = makeAnswer({}, new UniqueEntityId('answer-id-2'))
    await inMemoryAnswersRepository.create(newAnswer1)
    await inMemoryAnswersRepository.create(newAnswer2)

    const result = await sut.execute({
      answerId: 'answer-id-1',
      authorId: 'author-id-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError('Not allowed.'))
    expect(inMemoryAnswersRepository.items.length).toBe(2)
  })
})
