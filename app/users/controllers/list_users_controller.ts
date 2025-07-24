import type { HttpContext } from '@adonisjs/core/http'
import User from '#users/models/user'

export default class ListUsersController {
  /**
   * @summary Liste des utilisateurs
   * @tag Users
   * @description Récupère la liste de tous les utilisateurs
   * @responseBody 200 - [{"id": "string", "username": "string", "email": "string", "slug": "string", "bio": "string", "avatarUrl": "string", "createdAt": "datetime", "updatedAt": "datetime"}]
   */
  public async index({ response }: HttpContext) {
    const users = await User.query()

    return response.json(users)
  }
}
