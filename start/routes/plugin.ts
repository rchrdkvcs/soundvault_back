import router from '@adonisjs/core/services/router'

const StorePluginController = () =>
  import('../../app/plugins/controllers/store_plugin_controller.js')

export default function pluginRoutes() {
  router
    .group(() => {
      router.post('/', [StorePluginController, 'execute'])
    })
    .prefix('plugins')
}
