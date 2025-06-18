export function load({ params }: { params: { slug: string } }): { path: string } {
    let slug = params.slug;
    if (!slug.startsWith('/')) {
        slug = '/' + slug;
    }

    return {
        path: slug
    };
}
