import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Category from '#categories/models/category'

export default class StoreCategoryController {
  static validator = vine.compile(
    vine.object({
      label: vine.string().minLength(3).maxLength(50),
    })
  )

  /**
   * @summary Crée une nouvelle catégorie
   * @tag Categories
   * @description Crée une nouvelle catégorie de plugins
   * @requestBody {"label": "string"}
   * @responseBody 201 - {"message": "Category created successfully", "data": {}}
   * @responseBody 422 - {"success": false, "message": "Validation failed"}
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(StoreCategoryController.validator)

    const category = await Category.create({
      label: data.label,
    })

    return response.created({
      message: 'Category created successfully',
      data: category.serialize(),
    })
  }
}
