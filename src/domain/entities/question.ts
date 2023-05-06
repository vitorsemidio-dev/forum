import { Entity } from '../../core/entities/entity';
import { UniqueEntityId } from '../../core/entities/unique-entity-id';
import { Optional } from '../../core/types/optional';
import { Slug } from './value-objects/slug';

interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId: UniqueEntityId;
  content: string;
  createdAt: Date;
  slug: Slug;
  updatedAt?: Date;
  title: string;
}

export class Question extends Entity<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );
    return question;
  }
}
