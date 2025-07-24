import type { HttpContext } from '@adonisjs/core/http'
import Plugin from '#plugins/models/plugin'

export default class ShowPluginController {
  /**
   * @summary Détails d'un plugin
   * @tag Plugins
   * @description Récupère les détails complets d'un plugin par son ID
   * @paramPath id - string - ID du plugin
   * @responseBody 200 - {"success": true, "data": {"id": "string", "name": "string", "description": "string", "version": "string", "price": 0, "author": {}, "categories": [], "tags": [], "images": [], "downloadCount": 0, "createdAt": "datetime"}}
   * @responseBody 404 - {"success": false, "message": "Plugin introuvable"}
   */
  async show({ params, response }: HttpContext) {
    try {
      const plugin = await Plugin.query()
        .where('id', params.id)
        .preload('author', (authorQuery) => {
          authorQuery.select('id', 'username', 'avatarUrl', 'slug', 'bio')
        })
        .preload('categories')
        .first()

      if (!plugin) {
        return response.notFound({
          success: false,
          message: 'Plugin introuvable',
        })
      }

      // Transformation pour le frontend
      const transformedPlugin = {
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        version: plugin.version,
        price: plugin.price / 100, // Convert from centimes to euros
        salePrice: plugin.salePrice ? plugin.salePrice / 100 : undefined,
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
          id: plugin.author.id,
          username: plugin.author.username,
          avatar: plugin.author.avatarUrl,
          bio: plugin.author.bio,
        },
        image: plugin.thumbnailUrl,
        images: [plugin.thumbnailUrl, ...(plugin.screenshots || [])].filter(Boolean),
        downloadCount: plugin.downloadCount,
        rating: 0, // TODO: Ajouter système de notation
        ratingCount: 0,
        createdAt: plugin.createdAt.toISO(),
        updatedAt: plugin.updatedAt?.toISO() || new Date().toISOString(),
        isFree: plugin.isFree,
        fileUrl: plugin.fileUrl,
        requirements: plugin.requirements,
        features: plugin.features || [],
        changelog: plugin.changelog,
        demoTrackUrl: plugin.demoTrackUrl,
        presetFiles: plugin.presetFiles || [],
      }

      return response.ok({
        success: true,
        data: transformedPlugin,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erreur lors de la récupération du plugin',
      })
    }
  }
}
