// The Studio's left column: Site first (one document), then Pages and Posts.
import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Site').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site')),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('post').title('Posts'),
    ]);
