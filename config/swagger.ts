import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  basePath: '/api',
  title: 'SoundVault API',
  version: '0.1.4',
  description: 'API du projet SoundVault',
  tagIndex: 1,
  productionEnv: 'production',
  info: {
    title: 'SoundVault API',
    version: '0.1.4',
    description: 'API du projet SoundVault',
  },
  snakeCase: true,
  debug: false,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {},
  authMiddlewares: ['auth', 'auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}
