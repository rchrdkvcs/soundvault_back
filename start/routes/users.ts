import router from '@adonisjs/core/services/router'

const ListUsersController = () => import('#users/controllers/list_users_controller')
const ShowUserController = () => import('#users/controllers/show_user_controller')
const ListUserPluginsController = () => import('#users/controllers/list_user_plugins_controller')

export default function userRoutes() {
  router
    .group(() => {
      router.get('/', [ListUsersController, 'execute'])
      router.get('/:id', [ShowUserController, 'execute'])
      router.get('/:id/plugins', [ListUserPluginsController, 'execute'])
    })
    .prefix('users')
}
