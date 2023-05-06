import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

interface EditQuestionUseCaseInput {
  authorId: string
  questionId: string
  content: string
  title: string
}

interface EditQuestionUseCaseOutput {
  question: Question
}

export class EditQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    title,
  }: EditQuestionUseCaseInput): Promise<EditQuestionUseCaseOutput> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if (question.authorId.toValue() !== authorId) {
      throw new Error('Not allowed.')
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return {
      question,
    }
  }
}
