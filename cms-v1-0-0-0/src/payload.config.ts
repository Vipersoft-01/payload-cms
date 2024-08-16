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

const m = path.resolve(__dirname, './emptyModuleMock.js')

export default buildConfig({
  admin: {
    css: path.resolve(__dirname, './files/css/main.scss'),
    autoLogin: {
      email: 'demo@payloadcms.com',
      password: 'demo',
      prefillOnly: true,
    },
    bundler: webpackBundler(), // bundler-config
    components: {
      beforeDashboard: [BeforeDashboard],
      beforeLogin: [BeforeLogin],
    },
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
  collections: [Users, Posts, Projects, Pages, Media, Categories, Websites],
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
      'websites',
    ],
    generateTitle: ({ doc }) => `Website.com — ${doc.title.value}`,
    generateDescription: ({ doc }) => doc.excerpt
  })
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
