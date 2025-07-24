import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import Plugin from '#plugins/models/plugin'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare label: string

  @column()
  declare description: string | null

  @manyToMany(() => Plugin, {
    pivotTable: 'category_plugin',
  })
  declare plugins: ManyToMany<typeof Plugin>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static generateUuid(category: Category) {
    category.id = ulid()
  }
}
