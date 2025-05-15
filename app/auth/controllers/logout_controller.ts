import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  public async execute({ response, auth }: HttpContext) {
    await auth.use('api').invalidateToken()

    return response.json({
      message: 'Logout successful',
    })
  }
}
