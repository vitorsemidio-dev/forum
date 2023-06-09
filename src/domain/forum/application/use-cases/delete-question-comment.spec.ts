import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

const makeSut = () => {
  const inMemoryQuestionCommentsRepository =
    new InMemoryQuestionCommentsRepository()
  const sut = new DeleteQuestionCommentUseCase(
    inMemoryQuestionCommentsRepository,
  )
  return { sut, inMemoryQuestionCommentsRepository }
}

describe('Delete Question Comment', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: DeleteQuestionCommentUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryQuestionCommentsRepository =
      dependencies.inMemoryQuestionCommentsRepository
    sut = dependencies.sut
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError('Not allowed'))
  })
})
