import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import User from '#users/models/user'

export default class LoginController {
  static validator = vine.compile(
    vine.object({
      email: vine.string().email(),
      password: vine.string().minLength(8),
    })
  )

  public async execute({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(LoginController.validator)

    const user = await User.verifyCredentials(data.email, data.password)
    const token = await auth.use('api').createToken(user)

    return response.json({
      user,
      token,
    })
  }
}
