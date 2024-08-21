import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrPublished } from '../../access/adminsOrPublished'
import { Archive } from '../../blocks/ArchiveBlock'
import { CallToAction } from '../../blocks/CallToAction'
import { Content } from '../../blocks/Content'
import { ContentMedia } from '../../blocks/ContentMedia'
import { MediaBlock } from '../../blocks/MediaBlock'
import { hero } from '../../fields/hero'
import { slugField } from '../../fields/slug'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
import { populatePublishedDate } from '../../hooks/populatePublishedDate'
import { updateEntityWithCurrentUserDetails } from '../../utilities/updateGlobalEntity'
import { HTMLConverterFeature, lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical'

export const Vacancies: CollectionConfig = {
    access: {
        create: () => true,
        delete: () => false,
        read: () => true,
        update: () => true,
    },
    admin: {
        defaultColumns: ['title', 'slug', 'updatedAt'],
        livePreview: {
            url: 'https://localhost:44357/',
            breakpoints: [
                {
                    label: 'Mobile',
                    name: 'mobile',
                    width: 375,
                    height: 667,
                },
                {
                    label: 'Tablet',
                    name: 'tablet',
                    width: 768,
                    height: 1024,
                },
                {
                    label: 'Desktop',
                    name: 'desktop',
                    width: 1440,
                    height: 900,
                },
            ],
        },
        // preview: (doc) => {
        //     return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
        //         `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${doc.slug !== 'home' ? (doc.slug as string) : ''
        //         }`,
        //     )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
        // },
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'website',
            type: 'text',
            access: {
                create: admins,
                read: admins,
                update: admins,
            }
        },
        {
            name: 'owner',
            type: 'text',
            access: {
                create: admins,
                read: admins,
                update: admins,
            }
        },
        {
            name: 'title',
            required: true,
            type: 'text',
        },
        {
            name: 'description',
            required: true,
            type: 'text'
        },
        {
            name: 'content',
            required: true,
            type: 'richText',
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                    ...defaultFeatures,
                    // The HTMLConverter Feature is the feature which manages the HTML serializers.
                    // If you do not pass any arguments to it, it will use the default serializers.
                    HTMLConverterFeature({}),
                ],
            })
        },
        lexicalHTML('content', { name: 'content_html' }),
        {
            name: 'publishedDate',
            admin: {
                position: 'sidebar',
            },
            type: 'date',
        },
        slugField(),
    ],
    hooks: {
        afterChange: [
            async ({ req, doc }) => {
                await updateEntityWithCurrentUserDetails(req, doc, "vacancies")
            }
        ],
        beforeChange: [populatePublishedDate],
    },
    slug: 'vacancies',
    versions: {
        drafts: true,
    },
}