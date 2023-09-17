import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { makeInMemoryAnswerRepository } from 'test/factories/make-in-memory-answer-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

const makeSut = () => {
  const inMemoryAnswersRepository = makeInMemoryAnswerRepository()
  const inMemoryAnswerAttachmentsRepository =
    new InMemoryAnswerAttachmentsRepository()
  const sut = new EditAnswerUseCase(
    inMemoryAnswersRepository,
    inMemoryAnswerAttachmentsRepository,
  )
  return { sut, inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository }
}

describe('EditAnswerUseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: EditAnswerUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryAnswersRepository = dependencies.inMemoryAnswersRepository
    inMemoryAnswerAttachmentsRepository =
      dependencies.inMemoryAnswerAttachmentsRepository
    sut = dependencies.sut
  })

  it('should edit a answer', async () => {
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
      attachmentIds: [],
      answerId: 'answer-id-1',
      authorId: 'author-id-1',
      content: 'new content updated',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'new content updated',
    })
  })

  it('should edit an answer with new attachments', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-id-1'),
    )
    await inMemoryAnswersRepository.create(newAnswer)
    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('attachment-id-1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('attachment-id-2'),
      }),
    )

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: newAnswer.content,
      attachmentIds: ['attachment-id-1', 'attachment-id-3'],
    })
    const answer = inMemoryAnswersRepository.items[0]
    const answerAttachments = answer.attachments.getItems()

    expect(result.isRight()).toBe(true)
    if (result.isLeft()) throw new Error('should not be left')
    expect(answer).toBe(result.value.answer)
    expect(answerAttachments.length).toBe(2)
    expect(answerAttachments[0].attachmentId.toString()).toBe('attachment-id-1')
    expect(answerAttachments[1].attachmentId.toString()).toBe('attachment-id-3')
  })

  it('should not edit a answer from another user', async () => {
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
      attachmentIds: [],
      answerId: 'answer-id-1',
      authorId: 'author-id-2',
      content: 'new content updated',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError('Not allowed.'))
  })
})
