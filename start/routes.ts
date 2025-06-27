/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// import router from '@adonisjs/core/services/router'

import swaggerRoutes from '#start/routes/swagger'
import authRoutes from '#start/routes/auth'
import pluginRoutes from '#start/routes/plugin'
import categoryRoutes from '#start/routes/category'

swaggerRoutes()
authRoutes()
pluginRoutes()
categoryRoutes()
