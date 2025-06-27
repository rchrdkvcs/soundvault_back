import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plugins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 26).primary()
      table.string('name', 255).notNullable()
      table.string('description', 500).notNullable()
      table.string('version', 50).notNullable()
      table.string('thumbnail_url').nullable()
      table.string('file_url').notNullable()

      table.string('author_id', 26).references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
