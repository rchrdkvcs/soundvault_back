import router from '@adonisjs/core/services/router'

const StoreCategoryController = () => import('#categories/controllers/store_category_controller')
const ListCategoriesController = () => import('#categories/controllers/list_categories_controller')
const ShowCategoryController = () => import('#categories/controllers/show_category_controller')

export default function categoryRoutes() {
  router
    .group(() => {
      router.get('/', [ListCategoriesController, 'execute'])
      router.get('/:id', [ShowCategoryController, 'execute'])
      router.post('/', [StoreCategoryController, 'execute'])
    })
    .prefix('categories')
}
