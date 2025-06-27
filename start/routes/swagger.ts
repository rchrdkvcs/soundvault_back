import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

export default function swaggerRoutes() {
  router.get('/swagger', async () => {
    return AutoSwagger.default.docs(router.toJSON(), swagger)
  })

  router.get('/', async () => {
    return AutoSwagger.default.ui('/swagger', swagger)
  })
}
