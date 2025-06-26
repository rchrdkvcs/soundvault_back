import type { HttpContext } from '@adonisjs/core/http'

export default class MeController {
  public async execute({ response, auth }: HttpContext) {
    const user = await auth.use('api').authenticate()

    return response.json(user)
  }
}
