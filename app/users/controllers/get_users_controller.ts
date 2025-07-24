import type { HttpContext } from '@adonisjs/core/http'
import User from '#users/models/user'

export default class GetUsersController {
  /**
   * @summary Liste de tous les utilisateurs
   * @tag Users
   * @description Récupère la liste complète des utilisateurs
   * @responseBody 200 - [{"id": "string", "username": "string", "email": "string", "slug": "string", "bio": "string", "avatarUrl": "string", "createdAt": "datetime", "updatedAt": "datetime"}]
   */
  public async index({ response }: HttpContext) {
    const users = await User.query()

    return response.json(users)
  }
}
