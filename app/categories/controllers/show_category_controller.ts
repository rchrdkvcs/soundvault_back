import type { HttpContext } from '@adonisjs/core/http'
import Category from '#categories/models/category'

export default class ShowCategoryController {
  async execute({ params, response }: HttpContext) {
    try {
      const category = await Category.query()
        .where('id', params.id)
        .preload('plugins', (query) => {
          query
            .preload('author', (authorQuery) => {
              authorQuery.select('id', 'username', 'avatarUrl')
            })
            .orderBy('createdAt', 'desc')
        })
        .first()

      if (!category) {
        return response.notFound({
          success: false,
          message: 'Catégorie introuvable',
        })
      }

      return response.ok({
        success: true,
        data: {
          id: category.id,
          label: category.label,
          description: category.description,
          pluginCount: category.plugins.length,
          plugins: category.plugins,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erreur lors de la récupération de la catégorie',
      })
    }
  }
}
