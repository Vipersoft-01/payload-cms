import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrPublished } from '../../access/adminsOrPublished'
import { slugField } from '../../fields/slug'
import { populatePublishedDate } from '../../hooks/populatePublishedDate'
import { revalidateWebsite } from './hooks/revalidateWebsite'

export const Websites: CollectionConfig = {
    access: {
        create: admins,
        delete: () => false,
        read: admins,
        update: admins,
    },
    admin: {
        defaultColumns: ['title'],
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            required: true,
            type: 'text',
        },
        {
            name: 'users',
            admin: {
                position: 'sidebar',
            },
            hasMany: true,
            relationTo: 'users',
            type: 'relationship',
        },
        slugField()
    ],
    hooks: {
        afterChange: [revalidateWebsite],
        beforeChange: [populatePublishedDate],
    },
    slug: 'websites',
    versions: {
        drafts: true,
    },
}
