import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type.error'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials.error'
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'

export class BaseResponseDto {
  statusCode!: number
  message!: string
}

export class ExceptionResponseDto extends BaseResponseDto {
  timestamp!: string
  path!: string
  method!: string
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    let message: string
    let status: number
    let logInConsole = true

    switch (exception.constructor) {
      case WrongCredentialsError:
        status = HttpStatus.UNAUTHORIZED
        message = (exception as WrongCredentialsError).message
        break
      case ResourceNotFoundError:
        status = HttpStatus.NOT_FOUND
        message = (exception as ResourceNotFoundError).message
        break
      case NotAllowedError:
        status = HttpStatus.FORBIDDEN
        message = (exception as NotAllowedError).message
        break
      case InvalidAttachmentTypeError:
        status = HttpStatus.BAD_REQUEST
        message = (exception as InvalidAttachmentTypeError).message
        break
      case HttpException:
        status = (exception as HttpException).getStatus()
        message = (exception as HttpException).message
        break
      case BadRequestException:
        status = HttpStatus.BAD_REQUEST
        message = (exception as BadRequestException).message
        break
      case NotFoundException:
        status = HttpStatus.NOT_FOUND
        message = (exception as NotFoundException).message
        logInConsole = message.includes('Cannot') ? false : logInConsole
        break
      case UnauthorizedException:
        status = HttpStatus.UNAUTHORIZED
        message = (exception as UnauthorizedException).message
        break
      case ForbiddenException:
        status = HttpStatus.FORBIDDEN
        message = (exception as ForbiddenException).message
        break
      default:
        status = (exception as any).status ?? HttpStatus.INTERNAL_SERVER_ERROR
        message = (exception as any).message ?? 'Internal server error'
        break
    }

    if (logInConsole)
      Logger.error(
        message,
        (exception as any).stack,
        `${request.method} ${request.url}`,
      )

    response
      .status(status)
      .json(this.GlobalResponseError(status, message, request))
  }
  private GlobalResponseError: (
    statusCode: number,
    message: string,
    request: Request,
  ) => ExceptionResponseDto = (
    statusCode: number,
    message: string,
    request: Request,
  ): ExceptionResponseDto => {
    return {
      statusCode: statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    }
  }
}
