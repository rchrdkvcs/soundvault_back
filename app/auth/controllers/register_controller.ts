import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import User from '#users/models/user'
import string from '@adonisjs/core/helpers/string'

export default class RegisterController {
  static validator = vine.compile(
    vine.object({
      username: vine
        .string()
        .minLength(3)
        .maxLength(20)
        .unique(async (db, value) => {
          const user = await db.from('users').where('username', value).first()
          return !user
        }),
      email: vine
        .string()
        .email()
        .unique(async (db, value) => {
          const user = await db.from('users').where('email', value).first()
          return !user
        }),
      password: vine.string().minLength(8),
      confirmPassword: vine.string().confirmed({ confirmationField: 'password' }),
    })
  )

  public async execute({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(RegisterController.validator)

    const { confirmPassword, ...userData } = data

    const user = await User.create({
      ...userData,
      slug: string.slug(userData.username),
    })
    const token = await auth.use('api').createToken(user)

    return response.json({
      user,
      token,
    })
  }
}
