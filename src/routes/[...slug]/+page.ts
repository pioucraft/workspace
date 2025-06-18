export function load({ params }: { params: { slug: string } }): { path: string } {
    return {
        path: params.slug
    };
}
