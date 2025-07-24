import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const StorePluginController = () => import('#plugins/controllers/store_plugin_controller')
const ListPluginsController = () => import('#plugins/controllers/list_plugins_controller')
const ShowPluginController = () => import('#plugins/controllers/show_plugin_controller')
const DownloadPluginController = () => import('#plugins/controllers/download_plugin_controller')

export default function pluginRoutes() {
  router
    .group(() => {
      // Routes publiques
      router.get('/', [ListPluginsController, 'execute'])
      router.get('/:id', [ShowPluginController, 'execute'])

      // Routes protégées
      router
        .group(() => {
          router.post('/', [StorePluginController, 'execute'])
          router.get('/:id/download', [DownloadPluginController, 'execute'])
        })
        .use(middleware.auth())
    })
    .prefix('plugins')
}
