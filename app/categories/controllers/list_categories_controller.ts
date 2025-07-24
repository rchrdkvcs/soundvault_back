import type { HttpContext } from '@adonisjs/core/http'
import Category from '#categories/models/category'

export default class ListCategoriesController {
  /**
   * @listCategories
   * @description Récupère la liste de toutes les catégories avec le nombre de plugins
   * @responseBody 200 - <CategoriesListResponse>
   * @responseBody 500 - {"success": false, "message": "Erreur serveur"}
   */
  async execute({ response }: HttpContext) {
    try {
      const categories = await Category.query()
        .preload('plugins', (query) => {
          query.select('id', 'name')
        })
        .orderBy('label', 'asc')

      // Transform pour inclure le count des plugins
      const categoriesWithCount = categories.map((category) => ({
        id: category.id,
        label: category.label,
        description: category.description,
        pluginCount: category.plugins.length,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      }))

      return response.ok({
        success: true,
        data: categoriesWithCount,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erreur lors de la récupération des catégories',
      })
    }
  }
}
