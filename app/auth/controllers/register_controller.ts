import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import User from '#users/models/user'

export default class RegisterController {
  static validator = vine.compile(
    vine.object({
      username: vine.string().minLength(3).maxLength(20),
      email: vine.string().email(),
      password: vine.string().minLength(8),
      confirmPassword: vine.string().confirmed({ confirmationField: 'password' }),
    })
  )

  public async execute({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(RegisterController.validator)

    const { confirmPassword, ...userData } = data

    const user = await User.create(userData)
    const token = await auth.use('api').createToken(user)

    return response.json({
      user,
      token,
    })
  }
}
