import { UseCaseError } from '@/core/errors/use-case.error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor(message = 'Not Allowed.') {
    super(message)
  }
}
