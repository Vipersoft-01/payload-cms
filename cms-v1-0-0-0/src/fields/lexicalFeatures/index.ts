import type { SerializedEditorState } from 'lexical'
import {
    type SanitizedEditorConfig,
    convertLexicalToHTML,
    consolidateHTMLConverters,
} from '@payloadcms/richtext-lexical'

export async function lexicalToHTML(editorData: SerializedEditorState, editorConfig: SanitizedEditorConfig) {
    return await convertLexicalToHTML({
        converters: consolidateHTMLConverters({ editorConfig }),
        data: editorData,
    })
}