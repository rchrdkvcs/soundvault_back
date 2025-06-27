import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Category from '#categories/models/category'

export default class StoreCategoryController {
  static validator = vine.compile(
    vine.object({
      label: vine.string().minLength(3).maxLength(50),
    })
  )

  async execute({ request, response }: HttpContext) {
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
