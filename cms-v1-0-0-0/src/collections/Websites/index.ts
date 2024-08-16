import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrPublished } from '../../access/adminsOrPublished'
import { slugField } from '../../fields/slug'
import { populatePublishedDate } from '../../hooks/populatePublishedDate'
import { revalidateWebsite } from './hooks/revalidateWebsite'
import { updateUserWebsites } from './hooks/updateUserWebsites'

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
            hooks: {
                afterChange: [async ({ value, req, previousValue = [], originalDoc, context }) => {

                    // set a flag in the context to prevent any updates to series having an effect on the episodes
                    if (context.hasUpdatedUsersAfterChange) return
                    context.hasUpdatedUsersAfterChange = true

                    const previousIDs = previousValue?.map((website) => website) || []
                    const currentIDs = value?.map((website) => website) || []

                    const userIDsAddedTowebsite = currentIDs.reduce((ids, website) => {
                        if (!previousIDs.includes(website)) {
                            ids.push(website)
                        }
                        return ids
                    }, [])

                    const userIDsRemovingwebsite = previousIDs.reduce((ids, website) => {
                        if (!currentIDs.includes(website)) {
                            ids.push(website)
                        }
                        return ids
                    }, [])

                    await updateUserWebsites({
                        req,
                        userIDsAddedTowebsite,
                        userIDsRemovingwebsite,
                        websiteID: originalDoc.id,
                        context,
                    })
                }]
            }
        },
        slugField()
    ],
    hooks: {
        beforeChange: [populatePublishedDate],
    },
    slug: 'websites',
    versions: {
        drafts: true,
    },
}
