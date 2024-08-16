import type { CollectionConfig } from 'payload/types'

import { email as validateEmail } from 'payload/dist/fields/validations'

import { admins } from '../../access/admins'
import { adminEmail } from '../../cron/shared'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { sanitizeDemoAdmin } from './hooks/sanitizeDemoAdmin'
import { updateWebsiteUsers } from './hooks/updateWebsiteUsers'

const Users: CollectionConfig = {
  access: {
    admin: admins,
    create: admins,
    delete: admins
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      validate: (value, args) => {
        // call the payload default email validation
        return validateEmail(value, args)
      },
    },
    {
      name: 'websites',
      admin: {
        position: 'sidebar',
      },
      access: {
        create: admins,
        read: admins,
        update: admins,
      },
      hasMany: true,
      relationTo: 'websites',
      type: 'relationship',
      hooks: {
        afterChange: [async ({ value, req, previousValue = [], originalDoc, context }) => {

          // set a flag in the context to prevent any updates to series having an effect on the episodes
          if (context.hasUpdatedWebsitesAfterChange) return
          context.hasUpdatedWebsitesAfterChange = true

          const previousIDs = previousValue?.map((website) => website) || []
          const currentIDs = value?.map((website) => website) || []

          const websiteIDsAddedToUser = currentIDs.reduce((ids, website) => {
            if (!previousIDs.includes(website)) {
              ids.push(website)
            }
            return ids
          }, [])

          const websiteIDsRemovingUser = previousIDs.reduce((ids, website) => {
            if (!currentIDs.includes(website)) {
              ids.push(website)
            }
            return ids
          }, [])

          await updateWebsiteUsers({
            req,
            websiteIDsAddedToUser,
            websiteIDsRemovingUser,
            userID: originalDoc.id,
            context,
          })
        }]
      }
    },
    {
      name: 'roles',
      access: {
        create: admins,
        read: admins,
        update: admins,
      },
      defaultValue: ['user'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'user',
          value: 'user',
        },
      ],
      type: 'select',
    },
  ],
  slug: 'users',
  timestamps: true,
}

export default Users
