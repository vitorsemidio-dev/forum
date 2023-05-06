import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

interface DeleteAnswerUseCaseInput {
  authorId: string
  answerId: string
}

interface DeleteAnswerUseCaseOutput {}

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseInput): Promise<DeleteAnswerUseCaseOutput> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (answer.authorId.toValue() !== authorId) {
      throw new Error('Not allowed.')
    }

    await this.answersRepository.delete(answerId)

    return {}
  }
}
