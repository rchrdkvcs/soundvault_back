import type { HttpContext } from '@adonisjs/core/http'
import User from '#users/models/user'

export default class ListUsersController {
  /**
   * @listUsers
   * @description Récupère la liste de tous les utilisateurs
   * @responseBody 200 - <UsersListResponse>
   */
  public async execute({ response }: HttpContext) {
    const users = await User.query()

    return response.json(users)
  }
}
