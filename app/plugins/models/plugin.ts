import { BaseModel, beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import { DateTime } from 'luxon'
import User from '#users/models/user'
import Category from '../../categories/models/category.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Plugin extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare version: string

  @column()
  declare thumbnailUrl: string | null

  @column()
  declare fileUrl: string

  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>

  @column()
  declare authorId: string

  @manyToMany(() => Category)
  declare categories: ManyToMany<typeof Category>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static generateUuid(plugin: Plugin) {
    plugin.id = ulid()
  }
}
