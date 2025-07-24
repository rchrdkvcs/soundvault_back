import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Plugin from '#plugins/models/plugin'
import { ulid } from 'ulid'
import drive from '@adonisjs/drive/services/main'

export default class StorePluginController {
  /**
   * @summary Crée un nouveau plugin
   * @tag Plugins
   * @description Crée un nouveau plugin avec fichiers et métadonnées
   * @requestBody {"name": "string", "description": "string", "version": "string", "categoryId": "string", "price": 0, "isFree": true, "vstFile": "file", "coverImage": "file", "tags": ["string"], "features": ["string"]}
   * @responseBody 201 - {"success": true, "message": "Plugin créé avec succès", "data": {}}
   * @responseBody 400 - {"success": false, "message": "Validation failed"}
   * @responseBody 401 - {"success": false, "message": "Unauthorized"}
   */
  static validator = vine.compile(
    vine.object({
      // Basic info
      name: vine.string().minLength(3).maxLength(100),
      description: vine.string().minLength(10).maxLength(1000),
      version: vine.string().optional(),
      categoryId: vine.string(), // Match frontend field name
      tags: vine.array(vine.string()).optional(), // Handle array format from FormData

      // Pricing
      price: vine
        .string()
        .transform((value) => Number.parseFloat(value) * 100)
        .optional(), // Convert to centimes
      isFree: vine.string().transform((value) => value === 'true'),

      // Files (coverImage now required for publication)
      vstFile: vine
        .file({
          size: '50mb',
          extnames: ['zip', 'vst', 'vst3', 'dll'],
        })
        .optional(),
      coverImage: vine.file({
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      }), // Required
      screenshots: vine
        .array(
          vine.file({
            size: '5mb',
            extnames: ['jpg', 'jpeg', 'png', 'webp'],
          })
        )
        .optional(),
      demoTrack: vine
        .file({
          size: '20mb',
          extnames: ['mp3', 'wav', 'ogg'],
        })
        .optional(),
      presets: vine
        .array(
          vine.file({
            // Match frontend field name
            size: '10mb',
            extnames: ['fxp', 'fxb', 'preset', 'zip'],
          })
        )
        .optional(),

      // Additional info
      features: vine.array(vine.string()).optional(), // Handle array format
      requirements: vine.string().optional(),
      changelog: vine.string().optional(),
    })
  )

  async store({ request, response, auth }: HttpContext) {
    try {
      const author = await auth.authenticate()

      // Validate data
      const data = await request.validateUsing(StorePluginController.validator)

      // Validate required files based on plugin type
      if (!data.vstFile && !data.presets?.length) {
        return response.badRequest({
          success: false,
          message: 'Au moins un fichier VST ou des presets sont requis',
        })
      }

      // Upload VST file
      let fileUrl = ''
      if (data.vstFile) {
        const fileKey = `plugins/vst/${ulid()}.${data.vstFile.extname}`
        await data.vstFile.moveToDisk(fileKey)
        fileUrl = await drive.use().getUrl(fileKey)
      }

      // Upload cover image
      let thumbnailUrl: string | null = null
      if (data.coverImage) {
        const thumbnailKey = `plugins/thumbnails/${ulid()}.${data.coverImage.extname}`
        await data.coverImage.moveToDisk(thumbnailKey)
        thumbnailUrl = await drive.use().getUrl(thumbnailKey)
      }

      // Upload screenshots
      const screenshotUrls: string[] = []
      if (data.screenshots) {
        for (const screenshot of data.screenshots) {
          const screenshotKey = `plugins/screenshots/${ulid()}.${screenshot.extname}`
          await screenshot.moveToDisk(screenshotKey)
          const screenshotUrl = await drive.use().getUrl(screenshotKey)
          screenshotUrls.push(screenshotUrl)
        }
      }

      // Upload demo track
      let demoTrackUrl: string | null = null
      if (data.demoTrack) {
        const demoKey = `plugins/demos/${ulid()}.${data.demoTrack.extname}`
        await data.demoTrack.moveToDisk(demoKey)
        demoTrackUrl = await drive.use().getUrl(demoKey)
      }

      // Upload preset files
      const presetUrls: string[] = []
      if (data.presets) {
        for (const presetFile of data.presets) {
          const presetKey = `plugins/presets/${ulid()}.${presetFile.extname}`
          await presetFile.moveToDisk(presetKey)
          const presetUrl = await drive.use().getUrl(presetKey)
          presetUrls.push(presetUrl)
        }
      }

      // Calculate price
      const isFree = data.isFree || false
      const price = isFree ? 0 : data.price || 0

      // Create plugin
      const plugin = await Plugin.create({
        name: data.name,
        description: data.description,
        version: data.version || '1.0.0',
        authorId: author.id,
        fileUrl,
        thumbnailUrl,
        price,
        screenshots: screenshotUrls,
        demoTrackUrl,
        presetFiles: presetUrls,
        tags: data.tags || [],
        features: data.features || [],
        requirements: data.requirements || null,
        changelog: data.changelog || null,
        downloadCount: 0,
        isPublished: true,
      })

      // Attach category
      if (data.categoryId) {
        await plugin.related('categories').attach([data.categoryId])
      }

      await plugin.load('categories')
      await plugin.load('author')

      return response.created({
        success: true,
        message: 'Plugin créé avec succès',
        data: plugin.serialize(),
      })
    } catch (error) {
      console.error('Error creating plugin:', error)

      // Handle validation errors
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          success: false,
          message: 'Données de validation invalides',
          errors: error.messages,
        })
      }

      // Handle file upload errors
      if (error.code === 'E_FILE_SIZE_EXCEEDED') {
        return response.badRequest({
          success: false,
          message: 'Un ou plusieurs fichiers dépassent la taille maximale autorisée',
        })
      }

      if (error.code === 'E_INVALID_FILE_TYPE') {
        return response.badRequest({
          success: false,
          message: 'Type de fichier non autorisé',
        })
      }

      return response.internalServerError({
        success: false,
        message: 'Erreur lors de la création du plugin',
      })
    }
  }
}
