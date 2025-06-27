import router from '@adonisjs/core/services/router'

const StoreCategoryController = () => import('#categories/controllers/store_category_controller')

export default function categoryRoutes() {
  router
    .group(() => {
      router.post('/', [StoreCategoryController, 'execute'])
    })
    .prefix('categories')
}
