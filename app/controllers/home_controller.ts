import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  public async render({ response }: HttpContext) {
    return response.json({ message: 'Binvenue sur API de SoundVault !' })
  }
}
