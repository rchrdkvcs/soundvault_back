import router from '@adonisjs/core/services/router'

const MeController = () => import('#auth/controllers/me_controller')
const RegisterController = () => import('#auth/controllers/register_controller')
const LoginController = () => import('#auth/controllers/login_controller')
const LogoutController = () => import('#auth/controllers/logout_controller')

export default function authRoutes() {
  router
    .group(() => {
      router.get('/me', [MeController, 'show'])
      router.post('/register', [RegisterController, 'store'])
      router.post('/login', [LoginController, 'store'])
      router.delete('/logout', [LogoutController, 'destroy'])
    })
    .prefix('auth')
}
