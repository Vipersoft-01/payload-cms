import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import { Pages } from './collections/Pages'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Media } from './collections/Media'
import Categories from './collections/Categories'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import BeforeDashboard from './components/BeforeDashboard'
import BeforeLogin from './components/BeforeLogin'
import { Websites } from './collections/Websites'
import seoPlugin from '@payloadcms/plugin-seo';
import { Logo, Icon } from './components/Logos'
import { Vacancies } from './collections/Vacancies'

const m = path.resolve(__dirname, './emptyModuleMock.js')

export default buildConfig({
  admin: {
    meta: {
      titleSuffix: '- Vipersoft',
      favicon: '/files/images/logo/fav-icon.png',
      ogImage: '/files/images/logo/logo.svg',
    },
    components: {
      graphics: {
        Logo,
        Icon
      },
      beforeDashboard: [BeforeDashboard],
      beforeLogin: [BeforeLogin]
    },
    css: path.resolve(__dirname, './files/css/main.scss'),
    // autoLogin: {
    //   email: 'demo@payloadcms.com',
    //   password: 'demo',
    //   prefillOnly: true,
    // },
    bundler: webpackBundler(), // bundler-config
    livePreview: {
      breakpoints: [
        {
          name: 'mobile',
          height: 667,
          label: 'Mobile',
          width: 375,
        },
      ],
    },
    user: Users.slug,
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          express: m,
          [path.resolve(__dirname, './cron/reset')]: m,
        },
      },
    }),
  },
  collections: [Users, Posts, Projects, Pages, Media, Categories, Websites, Vacancies],
  editor: lexicalEditor({}),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud(),
  seoPlugin({
    collections: [
      'websites', 'pages', 'vacancies'
    ],
    generateTitle: () => `Website.com — example text that should be clear`,
    generateDescription: () => 'Discover the power of our newly upgraded CMS system! Seamlessly manage your content with enhanced features, user-friendly navigation, and robust tools designed to boost productivity. Experience efficiency like never before with our state-of-the-art platform.'
  })
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
