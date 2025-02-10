import { HTMLConverter, HTMLConverterFeature, lexicalEditor, lexicalHTML } from "@payloadcms/richtext-lexical"
import { CollectionConfig } from "payload"

type Converter = HTMLConverter<any>

const VideoHTMLConverter: Converter = {
    converter: async ({ node, converters, parent, req, draft, overrideAccess, showHiddenFields, currentDepth, depth }) => {
        if (node.type === 'upload' && node.relationTo === 'media' && node.value) {
            const doc = (await req?.payload?.findByID({
                collection: "media",
                id: node.value
            })) || undefined;

            return doc ? `<video controls width="100%">
                <source src="${doc.url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>` : `[Video not found]`
        }
        return "non media";
    },
    nodeTypes: ['upload']
}

const RichText: CollectionConfig = {
    slug: 'richText',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'text',
            type: 'richText',
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                    ...defaultFeatures,
                    HTMLConverterFeature({
                        converters: ({ defaultConverters }) => {
                            return [
                                ...defaultConverters,
                                VideoHTMLConverter,
                            ]
                        }
                    }),
                ]
            }),
            required: true,
            localized: true,
        },
        lexicalHTML('text', { name: 'textHtml' }),
    ],
    hooks: {
        afterChange: [],
        afterDelete: [],
        beforeLogin: [],
        beforeChange: [],
    },
}

export default RichText