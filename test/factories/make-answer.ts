import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'
import { fakerPtBr } from 'test/utils/faker'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
): Answer {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId(),
      content: fakerPtBr.lorem.text(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return answer
}
