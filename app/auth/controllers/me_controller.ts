import type { HttpContext } from '@adonisjs/core/http'

export default class MeController {
  /**
   * @summary Informations utilisateur connecté
   * @tag Authentication
   * @description Récupère les informations de l'utilisateur actuellement connecté
   * @responseBody 200 - {"id": "string", "email": "string", "username": "string", "slug": "string", "bio": "string", "avatarUrl": "string", "createdAt": "datetime", "updatedAt": "datetime"}
   * @responseBody 401 - {"success": false, "message": "Unauthorized"}
   */
  public async show({ response, auth }: HttpContext) {
    const user = await auth.use('api').authenticate()

    return response.json(user)
  }
}
