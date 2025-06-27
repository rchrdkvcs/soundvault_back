import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Plugin from '../models/plugin.js'
import { ulid } from 'ulid'
import drive from '@adonisjs/drive/services/main'

export default class StorePluginController {
  static validator = vine.compile(
    vine.object({
      name: vine.string().minLength(3).maxLength(20),
      description: vine.string().minLength(10).maxLength(200),
      version: vine.string().regex(/^\d+\.\d+\.\d+$/),
      categories: vine.string().transform((value) => {
        try {
          return JSON.parse(value)
        } catch {
          return value.split(',')
        }
      }),
      file: vine.file({ size: '10mb', extnames: ['zip'] }),
      thumbnail: vine.file({ size: '2mb', extnames: ['jpg', 'jpeg', 'png'] }).optional(),
    })
  )

  async execute({ request, response, auth }: HttpContext) {
    const author = await auth.authenticate()
    const data = await request.validateUsing(StorePluginController.validator)

    const fileKey = `plugins/vst/${ulid()}.${data.file.extname}`
    await data.file.moveToDisk(fileKey)

    let thumbnailKey: string | null = null

    if (data.thumbnail) {
      thumbnailKey = `plugins/thumbnails/${ulid()}.${data.thumbnail.extname}`
      await data.thumbnail.moveToDisk(thumbnailKey)
    }

    const fileUrl = await drive.use().getUrl(fileKey)
    const thumbnailUrl =
      data.thumbnail && thumbnailKey ? await drive.use().getUrl(thumbnailKey) : null

    const plugin = await Plugin.create({
      name: data.name,
      description: data.description,
      version: data.version,
      authorId: author.id,
      fileUrl,
      thumbnailUrl: thumbnailUrl || null,
    })

    await plugin.related('categories').attach(data.categories)

    await plugin.load('categories')

    return response.created({
      message: 'Plugin created successfully',
      data: plugin.serialize(),
    })
  }
}
