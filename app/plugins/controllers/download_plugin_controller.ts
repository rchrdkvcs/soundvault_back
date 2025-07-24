import type { HttpContext } from '@adonisjs/core/http'
import Plugin from '#plugins/models/plugin'
import drive from '@adonisjs/drive/services/main'

export default class DownloadPluginController {
  /**
   * @downloadPlugin
   * @description Télécharge un fichier plugin
   * @paramPath id - string - ID du plugin
   * @responseBody 200 - Plugin file stream
   * @responseBody 404 - {"success": false, "message": "Plugin introuvable"}
   * @responseBody 401 - {"success": false, "message": "Unauthorized"}
   */
  async execute({ params, response, auth }: HttpContext) {
    try {
      // Vérification de l'authentification
      await auth.authenticate()

      const plugin = await Plugin.find(params.id)

      if (!plugin) {
        return response.notFound({
          success: false,
          message: 'Plugin introuvable',
        })
      }

      // TODO: Vérifier si l'utilisateur a le droit de télécharger (achat, gratuit, etc.)

      // Incrémenter le compteur de téléchargements
      await plugin.merge({ downloadCount: plugin.downloadCount + 1 }).save()

      // TODO: Enregistrer le téléchargement dans une table de logs

      // TODO: Vérifier l'accès au fichier selon le type de plugin (gratuit/payant)

      if (!plugin.fileUrl) {
        return response.badRequest({
          success: false,
          message: 'Aucun fichier disponible pour ce plugin',
        })
      }

      try {
        // Utiliser Drive pour gérer le téléchargement
        const stream = await drive.use().getStream(plugin.fileUrl)

        // Extraire l'extension du nom du fichier
        const extension = plugin.fileUrl.split('.').pop() || ''
        let contentType = 'application/octet-stream'

        switch (extension.toLowerCase()) {
          case 'zip':
            contentType = 'application/zip'
            break
          case 'vst':
          case 'vst3':
            contentType = 'application/octet-stream'
            break
          case 'dll':
            contentType = 'application/x-msdownload'
            break
        }

        // Nom du fichier pour le téléchargement
        const filename = `${plugin.name.replace(/[^a-zA-Z0-9]/g, '_')}_v${plugin.version}.${extension}`

        response.header('Content-Type', contentType)
        response.header('Content-Disposition', `attachment; filename="${filename}"`)

        return response.stream(stream)
      } catch (fileError) {
        return response.notFound({
          success: false,
          message: 'Fichier plugin introuvable sur le serveur',
        })
      }
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erreur lors du téléchargement du plugin',
      })
    }
  }
}
