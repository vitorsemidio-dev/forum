import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { TokenPayload } from './../../auth/jwt.strategy'

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  @Post()
  async handle(@CurrentUser() user: TokenPayload) {
    console.log(user)
  }
}
