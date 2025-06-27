import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'category_plugin'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('plugin_id', 26).references('id').inTable('plugins').onDelete('CASCADE')
      table.string('category_id', 26).references('id').inTable('categories').onDelete('CASCADE')

      table.primary(['plugin_id', 'category_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
