import type { HttpContext } from '@adonisjs/core/http'
import User from '#users/models/user'
import Plugin from '#plugins/models/plugin'
import vine from '@vinejs/vine'

export default class ListUserPluginsController {
  /**
   * @summary Plugins d'un utilisateur
   * @tag Users
   * @description Récupère la liste des plugins d'un utilisateur avec pagination
   * @paramPath id - string - ID ou slug de l'utilisateur
   * @paramQuery page - number - Numéro de page (défaut: 1)
   * @paramQuery limit - number - Nombre d'éléments par page (défaut: 12, max: 50)
   * @paramQuery category - string - Filtrer par ID de catégorie
   * @responseBody 200 - {"success": true, "data": [], "meta": {"total": 0, "perPage": 12, "currentPage": 1, "lastPage": 1, "firstPage": 1, "hasNext": false, "hasPrev": false, "user": {}}}
   * @responseBody 404 - {"success": false, "message": "Utilisateur introuvable"}
   */
  async index({ params, request, response }: HttpContext) {
    try {
      // Validation des paramètres
      const validator = vine.compile(
        vine.object({
          page: vine.number().min(1).optional(),
          limit: vine.number().min(1).max(50).optional(),
          category: vine.string().optional(),
        })
      )

      const { page = 1, limit = 12, category } = await request.validateUsing(validator)

      // Vérifier que l'utilisateur existe
      const user = await User.query().where('id', params.id).orWhere('slug', params.id).first()

      if (!user) {
        return response.notFound({
          success: false,
          message: 'Utilisateur introuvable',
        })
      }

      // Requête pour les plugins de l'utilisateur
      let pluginsQuery = Plugin.query()
        .where('authorId', user.id)
        .preload('categories', (categoryQuery) => {
          categoryQuery.select('id', 'label')
        })
        .orderBy('createdAt', 'desc')

      // Filtrage par catégorie si spécifié
      if (category) {
        pluginsQuery = pluginsQuery.whereHas('categories', (categoryQuery) => {
          categoryQuery.where('id', category)
        })
      }

      const plugins = await pluginsQuery.paginate(page, limit)

      // Transformation des données
      const transformedPlugins = plugins.all().map((plugin) => ({
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        version: plugin.version,
        price: (plugin.price || 0) / 100, // Convert from centimes to euros
        category:
          plugin.categories.length > 0
            ? {
                id: plugin.categories[0].id,
                name: plugin.categories[0].label,
                slug: plugin.categories[0].label.toLowerCase().replace(/\s+/g, '-'),
              }
            : null,
        tags: plugin.tags || [],
        author: {
          id: user.id,
          username: user.username,
          avatar: user.avatarUrl,
        },
        image: plugin.thumbnailUrl,
        images: [plugin.thumbnailUrl, ...(plugin.screenshots || [])].filter(Boolean),
        downloadCount: plugin.downloadCount || 0,
        rating: 0, // TODO: Ajouter système de notation
        ratingCount: 0,
        createdAt: plugin.createdAt.toISO(),
        updatedAt: plugin.updatedAt?.toISO() || new Date().toISOString(),
        isFree: plugin.price === 0,
      }))

      return response.ok({
        success: true,
        data: transformedPlugins,
        meta: {
          total: plugins.total,
          perPage: plugins.perPage,
          currentPage: plugins.currentPage,
          lastPage: plugins.lastPage,
          firstPage: plugins.firstPage,
          hasNext: plugins.hasPages,
          hasPrev: plugins.currentPage > 1,
          user: {
            id: user.id,
            username: user.username,
            slug: user.slug,
            avatarUrl: user.avatarUrl,
          },
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: "Erreur lors de la récupération des plugins de l'utilisateur",
      })
    }
  }
}
