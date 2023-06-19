import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { makeInMemoryAnswerRepository } from 'test/factories/make-in-memory-answer-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

const makeSut = () => {
  const inMemoryAnswersRepository = makeInMemoryAnswerRepository()
  const inMemoryAnswerCommentsRepository =
    new InMemoryAnswerCommentsRepository()
  const sut = new CommentOnAnswerUseCase(
    inMemoryAnswersRepository,
    inMemoryAnswerCommentsRepository,
  )
  return { sut, inMemoryAnswersRepository, inMemoryAnswerCommentsRepository }
}

describe('Comment on Answer', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: CommentOnAnswerUseCase
  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryAnswersRepository = dependencies.inMemoryAnswersRepository
    inMemoryAnswerCommentsRepository =
      dependencies.inMemoryAnswerCommentsRepository
    sut = dependencies.sut
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Comentário teste',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Comentário teste',
    )
  })
})
