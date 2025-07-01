import router from '@adonisjs/core/services/router'

const StorePluginController = () => import('#plugins/controllers/store_plugin_controller')

export default function pluginRoutes() {
  router
    .group(() => {
      router.post('/', [StorePluginController, 'execute'])
    })
    .prefix('plugins')
}
