import router from '@adonisjs/core/services/router'

const GetUsersController = () => import('#users/controllers/get_users_controller')

router
  .group(() => {
    router.get('/', [GetUsersController, 'execute'])
  })
  .prefix('users')
