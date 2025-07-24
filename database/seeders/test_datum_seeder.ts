import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#users/models/user'
import Category from '#categories/models/category'
import Plugin from '#plugins/models/plugin'

export default class extends BaseSeeder {
  async run() {
    // Créer des utilisateurs de test
    const users = await User.createMany([
      {
        username: 'xfer_records',
        email: 'contact@xferrecords.com',
        password: 'password123',
        slug: 'xfer-records',
        bio: 'Studio de production professionnel spécialisé dans les synthétiseurs',
      },
      {
        username: 'fabfilter_team',
        email: 'info@fabfilter.com',
        password: 'password123',
        slug: 'fabfilter-team',
        bio: "Développeurs d'outils de mixage et mastering de haute qualité",
      },
      {
        username: 'vital_dev',
        email: 'matt@vital-audio.com',
        password: 'password123',
        slug: 'vital-dev',
        bio: 'Créateur de synthétiseurs open source modernes',
      },
    ])

    // Créer des catégories
    const categories = await Category.createMany([
      {
        label: 'Synthétiseurs',
        description: 'Synthétiseurs virtuels et générateurs de sons',
      },
      {
        label: 'Effets',
        description: "Plugins d'effets audio pour le mixage et mastering",
      },
      {
        label: 'Drums',
        description: 'Boîtes à rythmes et samples de percussions',
      },
      {
        label: 'Utilitaires',
        description: "Outils d'analyse et utilitaires audio",
      },
    ])

    // Créer des plugins de test
    const plugins = await Plugin.createMany([
      {
        name: 'Serum Pro',
        description:
          'Synthétiseur wavetable révolutionnaire avec des capacités de modulation infinies. Parfait pour la production EDM, pop et hip-hop moderne.',
        version: '2.1.0',
        price: 19900, // 199€ en centimes
        authorId: users[0].id,
        thumbnailUrl: '/uploads/plugins/serum-thumbnail.jpg',
        fileUrl: '/uploads/plugins/serum-pro.zip',
        tags: ['wavetable', 'synth', 'modulation', 'edm'],
        features: [
          'Plus de 450 presets haute qualité',
          'Oscillateurs wavetable avancés',
          'Matrix de modulation flexible',
          'Effets intégrés professionnels',
          'Interface moderne et intuitive',
        ],
        requirements: 'Windows 10+ ou macOS 10.15+, 4GB RAM, VST3/AU/AAX',
        downloadCount: 15420,
        isPublished: true,
      },
      {
        name: 'Vital Synth',
        description:
          'Synthétiseur wavetable gratuit et open source avec une interface moderne et des capacités sonores impressionnantes.',
        version: '1.5.5',
        price: 0,
        authorId: users[2].id,
        thumbnailUrl: '/uploads/plugins/vital-thumbnail.jpg',
        fileUrl: '/uploads/plugins/vital-synth.zip',
        tags: ['wavetable', 'free', 'modern', 'open-source'],
        features: [
          'Complètement gratuit',
          'Interface utilisateur moderne',
          'Synthèse wavetable puissante',
          'Effets de qualité studio',
          'Communauté active',
        ],
        requirements: 'Windows 10+ ou macOS 10.14+, 2GB RAM, VST3/AU',
        downloadCount: 25680,
        isPublished: true,
      },
      {
        name: 'FabFilter Pro-Q 3',
        description:
          'Égaliseur professionnel avec analyse spectrale en temps réel, parfait pour le mixage et le mastering.',
        version: '3.24',
        price: 17900, // 179€
        salePrice: 11900, // 119€ en promo
        authorId: users[1].id,
        thumbnailUrl: '/uploads/plugins/proq3-thumbnail.jpg',
        fileUrl: '/uploads/plugins/fabfilter-proq3.zip',
        tags: ['eq', 'mastering', 'professional', 'mixing'],
        features: [
          'Analyse spectrale en temps réel',
          'Interface intuitive et moderne',
          'Qualité audio exceptionnelle',
          'Presets professionnels inclus',
          'Compatible avec tous les DAW',
        ],
        requirements: 'Windows 10+ ou macOS 10.13+, 4GB RAM, VST/VST3/AU/AAX',
        downloadCount: 12340,
        isPublished: true,
      },
      {
        name: 'Analog Dreams',
        description:
          'Collection de synthétiseurs analogiques virtuels inspirés des classiques des années 70 et 80.',
        version: '1.2.0',
        price: 8900, // 89€
        authorId: users[0].id,
        thumbnailUrl: '/uploads/plugins/analog-dreams-thumbnail.jpg',
        fileUrl: '/uploads/plugins/analog-dreams.zip',
        tags: ['analog', 'vintage', 'classic', 'retro'],
        features: [
          '5 synthétiseurs vintage recréés',
          'Modélisation analogique authentique',
          'Plus de 200 presets vintage',
          'Effets vintage intégrés',
        ],
        requirements: 'Windows 8+ ou macOS 10.12+, 2GB RAM, VST/VST3/AU',
        downloadCount: 8750,
        isPublished: true,
      },
    ])

    // Associer les plugins aux catégories
    await plugins[0].related('categories').attach([categories[0].id]) // Serum -> Synthétiseurs
    await plugins[1].related('categories').attach([categories[0].id]) // Vital -> Synthétiseurs
    await plugins[2].related('categories').attach([categories[1].id]) // Pro-Q -> Effets
    await plugins[3].related('categories').attach([categories[0].id]) // Analog Dreams -> Synthétiseurs

    console.log('✅ Données de test créées avec succès!')
    console.log(`👤 ${users.length} utilisateurs`)
    console.log(`📂 ${categories.length} catégories`)
    console.log(`🎵 ${plugins.length} plugins`)
  }
}
