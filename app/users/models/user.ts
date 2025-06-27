import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { ulid } from 'ulid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare bio: string | null

  @column()
  declare avatarUrl: string | null

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
<<<<<<<< HEAD:app/models/user.ts
========

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeCreate()
  static generateUuid(user: User) {
    user.id = ulid()
  }
>>>>>>>> 8998445 (refactor: reorganize project structure and implement initial routes for authentication, plugins, and categories):app/users/models/user.ts
}
