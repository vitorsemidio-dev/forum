import { Controller, Post } from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwtService: JwtService) {}

  @Post()
  async handle() {
    const token = this.jwtService.sign({ id: 'any_id' })
    return { token }
  }
}
