import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
): Question {
  const question = Question.create(
    {
      title: 'Example Question',
      slug: Slug.create('example-question'),
      authorId: new UniqueEntityId('any_author_id'),
      content: 'lorem ipsum dolor sit amet',
      ...override,
    },
    id,
  )

  return question
}
