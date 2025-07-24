import type { HttpContext } from '@adonisjs/core/http'
import Plugin from '#plugins/models/plugin'
import vine from '@vinejs/vine'

export default class ListPluginsController {
  async execute({ request, response }: HttpContext) {
    try {
      // Validation des paramètres de requête
      const validator = vine.compile(
        vine.object({
          search: vine.string().optional(),
          category: vine.string().optional(),
          author: vine.string().optional(),
          sort: vine
            .enum(['name', 'date', 'downloads', 'newest', 'oldest', 'price-asc', 'price-desc'])
            .optional(),
          order: vine.enum(['asc', 'desc']).optional(),
          free: vine
            .string()
            .transform((value) => value === 'true')
            .optional(),
          page: vine.number().min(1).optional(),
          limit: vine.number().min(1).max(50).optional(),
        })
      )

      const {
        search,
        category,
        author,
        sort = 'newest',
        order = 'desc',
        free,
        page = 1,
        limit = 12,
      } = await request.validateUsing(validator)

      // Construction de la requête
      let query = Plugin.query()
        .preload('author', (authorQuery) => {
          authorQuery.select('id', 'username', 'avatarUrl', 'slug')
        })
        .preload('categories', (categoryQuery) => {
          categoryQuery.select('id', 'label')
        })

      // Filtrage par recherche textuelle
      if (search) {
        query = query.where((builder) => {
          builder.whereILike('name', `%${search}%`).orWhereILike('description', `%${search}%`)
        })
      }

      // Filtrage par catégorie
      if (category) {
        query = query.whereHas('categories', (categoryQuery) => {
          categoryQuery.where('id', category)
        })
      }

      // Filtrage par auteur
      if (author) {
        query = query.where('authorId', author)
      }

      // Filtrage par prix (gratuit ou payant)
      if (free !== undefined) {
        if (free) {
          query = query.where('price', 0)
        } else {
          query = query.where('price', '>', 0)
        }
      }

      // Tri
      switch (sort) {
        case 'name':
          query = query.orderBy('name', order)
          break
        case 'downloads':
          query = query.orderBy('downloadCount', order)
          break
        case 'price-asc':
          query = query.orderBy('price', 'asc')
          break
        case 'price-desc':
          query = query.orderBy('price', 'desc')
          break
        case 'oldest':
          query = query.orderBy('createdAt', 'asc')
          break
        case 'date':
        case 'newest':
        default:
          query = query.orderBy('createdAt', 'desc')
          break
      }

      // Pagination
      const plugins = await query.paginate(page, limit)

      // Transformation des données pour le frontend
      const transformedData = plugins.all().map((plugin) => ({
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        version: plugin.version,
        price: (plugin.price || 0) / 100, // Convert from centimes to euros
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
        },
        image: plugin.thumbnailUrl,
        images: [plugin.thumbnailUrl, ...(plugin.screenshots || [])].filter(Boolean),
        downloadCount: plugin.downloadCount || 0,
        rating: 0, // TODO: Ajouter système de notation
        ratingCount: 0,
        createdAt: plugin.createdAt ? plugin.createdAt.toISO() : new Date().toISOString(),
        updatedAt: plugin.updatedAt ? plugin.updatedAt.toISO() : new Date().toISOString(),
        isFree: plugin.price === 0,
      }))

      return response.ok({
        success: true,
        data: transformedData,
        meta: {
          total: plugins.total,
          perPage: plugins.perPage,
          currentPage: plugins.currentPage,
          lastPage: plugins.lastPage,
          firstPage: plugins.firstPage,
          hasNext: plugins.hasPages,
          hasPrev: plugins.currentPage > 1,
        },
      })
    } catch (error) {
      console.error('Error in ListPluginsController:', error)
      return response.internalServerError({
        success: false,
        message: 'Erreur lors de la récupération des plugins',
        error: error.message,
      })
    }
  }
}
