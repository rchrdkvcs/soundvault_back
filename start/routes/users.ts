import router from '@adonisjs/core/services/router'

const ListUsersController = () => import('#users/controllers/list_users_controller')

export default function usersRoutes() {
  router
    .group(() => {
      router.get('/', [ListUsersController, 'execute'])
    })
    .prefix('users')
}
