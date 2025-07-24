import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plugins'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Pricing
      table.integer('price').defaultTo(0) // Prix en centimes
      table.integer('sale_price').nullable() // Prix de vente (promo)

      // Media files
      table.json('screenshots').nullable() // Array d'URLs
      table.string('demo_track_url').nullable() // URL audio démo
      table.json('preset_files').nullable() // Array d'URLs des presets

      // Metadata
      table.json('tags').nullable() // Array de tags
      table.json('features').nullable() // Array de fonctionnalités
      table.text('requirements').nullable() // Configuration requise
      table.text('changelog').nullable() // Notes de version

      // Counters
      table.integer('download_count').defaultTo(0)

      // Status
      table.boolean('is_published').defaultTo(true)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('price')
      table.dropColumn('sale_price')
      table.dropColumn('screenshots')
      table.dropColumn('demo_track_url')
      table.dropColumn('preset_files')
      table.dropColumn('tags')
      table.dropColumn('features')
      table.dropColumn('requirements')
      table.dropColumn('changelog')
      table.dropColumn('download_count')
      table.dropColumn('is_published')
    })
  }
}
