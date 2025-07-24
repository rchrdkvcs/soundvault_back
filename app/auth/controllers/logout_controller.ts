import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  /**
   * @summary Déconnecte l'utilisateur
   * @tag Authentication
   * @description Invalide le token d'accès de l'utilisateur connecté
   * @responseBody 200 - {"message": "Logout successful"}
   * @responseBody 401 - {"success": false, "message": "Unauthorized"}
   */
  public async destroy({ response, auth }: HttpContext) {
    await auth.use('api').invalidateToken()

    return response.json({
      message: 'Logout successful',
    })
  }
}
