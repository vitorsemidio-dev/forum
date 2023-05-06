import { Entity } from '../../core/entities/entity';
import { Slug } from './value-objects/slug';

interface QuestionProps {
  title: string;
  slug: Slug;
  content: string;
  authorId: string;
}

export class Question extends Entity<QuestionProps> {}
