import {
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
  manyToMany,
  computed,
} from '@adonisjs/lucid/orm'
import { ulid } from 'ulid'
import { DateTime } from 'luxon'
import User from '#users/models/user'
import Category from '#categories/models/category'
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

  // Pricing
  @column()
  declare price: number // Prix en centimes

  @column()
  declare salePrice: number | null // Prix de vente (promo)

  // Media files
  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return value || []
    },
  })
  declare screenshots: string[]

  @column()
  declare demoTrackUrl: string | null

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return value || []
    },
  })
  declare presetFiles: string[]

  // Metadata
  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return value || []
    },
  })
  declare tags: string[]

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return value || []
    },
  })
  declare features: string[]

  @column()
  declare requirements: string | null

  @column()
  declare changelog: string | null

  // Counters
  @column()
  declare downloadCount: number

  // Status
  @column()
  declare isPublished: boolean

  // Relations
  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  declare author: BelongsTo<typeof User>

  @column()
  declare authorId: string

  @manyToMany(() => Category, {
    pivotTable: 'category_plugin',
  })
  declare categories: ManyToMany<typeof Category>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Computed properties
  @computed()
  public get isFree() {
    return this.price === 0
  }

  @computed()
  public get isOnSale() {
    return this.salePrice !== null && this.salePrice < this.price
  }

  @computed()
  public get displayPrice() {
    if (this.price === 0) return 'Gratuit'
    const price = this.salePrice || this.price
    return `${(price / 100).toFixed(2)}€`
  }

  @beforeCreate()
  static generateUuid(plugin: Plugin) {
    plugin.id = ulid()
  }
}
