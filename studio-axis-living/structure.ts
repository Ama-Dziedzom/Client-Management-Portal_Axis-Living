import { type StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
    S.list()
        .title('Content')
        .items([
            // Singleton: Home Page
            S.listItem()
                .title('Home Page')
                .id('home')
                .child(
                    S.document()
                        .schemaType('home')
                        .documentId('home')
                ),

            // Singleton: About Page
            S.listItem()
                .title('About Page')
                .id('about')
                .child(
                    S.document()
                        .schemaType('about')
                        .documentId('about')
                ),

            // Singleton: Site Settings / Header / Footer
            S.listItem()
                .title('Brand & Navigation')
                .id('siteSettings')
                .child(
                    S.document()
                        .schemaType('siteSettings')
                        .documentId('siteSettings')
                ),

            S.divider(),

            // Regular document types
            ...S.documentTypeListItems().filter(
                (listItem) => !['home', 'about', 'siteSettings'].includes(listItem.getId()!)
            ),
        ])
