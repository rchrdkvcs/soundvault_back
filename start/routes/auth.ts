import router from '@adonisjs/core/services/router'

const RegisterController = () => import('#auth/controllers/register_controller')
const LoginController = () => import('#auth/controllers/login_controller')
const LogoutController = () => import('#auth/controllers/logout_controller')

router
  .group(() => {
    router.post('/register', [RegisterController, 'execute'])
    router.post('/login', [LoginController, 'execute'])
    router.delete('/logout', [LogoutController, 'execute'])
  })
  .prefix('auth')
