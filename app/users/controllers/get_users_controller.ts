import type { HttpContext } from '@adonisjs/core/http'
import User from '#users/models/user'

export default class GetUsersController {
  public async execute({ response }: HttpContext) {
    const users = await User.query()

    return response.json(users)
  }
}
