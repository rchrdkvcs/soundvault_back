import type { HttpContext } from '@adonisjs/core/http'
import User from '#users/models/user'
import Plugin from '#plugins/models/plugin'

export default class ShowUserController {
  /**
   * @summary Profil utilisateur
   * @tag Users
   * @description Récupère le profil public d'un utilisateur avec ses plugins
   * @paramPath id - string - ID ou slug de l'utilisateur
   * @responseBody 200 - {"success": true, "data": {"id": "string", "username": "string", "slug": "string", "bio": "string", "avatarUrl": "string", "pluginCount": 0, "plugins": [], "joinedAt": "datetime"}}
   * @responseBody 404 - {"success": false, "message": "Utilisateur introuvable"}
   */
  async show({ params, response }: HttpContext) {
    try {
      const user = await User.query().where('id', params.id).orWhere('slug', params.id).first()

      if (!user) {
        return response.notFound({
          success: false,
          message: 'Utilisateur introuvable',
        })
      }

      // Récupérer les plugins de l'utilisateur séparément
      const plugins = await Plugin.query()
        .where('authorId', user.id)
        .preload('categories', (categoryQuery) => {
          categoryQuery.select('id', 'label')
        })
        .orderBy('createdAt', 'desc')

      // Données publiques de l'utilisateur
      const publicUserData = {
        id: user.id,
        username: user.username,
        slug: user.slug,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        pluginCount: plugins.length,
        plugins: plugins.map((plugin) => ({
          id: plugin.id,
          name: plugin.name,
          description: plugin.description,
          version: plugin.version,
          thumbnailUrl: plugin.thumbnailUrl,
          category:
            plugin.categories.length > 0
              ? {
                  id: plugin.categories[0].id,
                  name: plugin.categories[0].label,
                  slug: plugin.categories[0].label.toLowerCase().replace(/\s+/g, '-'),
                }
              : null,
          createdAt: plugin.createdAt.toISO(),
          updatedAt: plugin.updatedAt?.toISO() || new Date().toISOString(),
        })),
        joinedAt: user.createdAt.toISO(),
      }

      return response.ok({
        success: true,
        data: publicUserData,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erreur lors de la récupération du profil utilisateur',
        error: error.message,
      })
    }
  }
}
