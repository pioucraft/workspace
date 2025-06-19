import { path } from '$lib/store/filesystem';

export function load({ params }: { params: { slug: string } }) {
	let slug = params.slug;
	if (!slug.startsWith('/')) {
		slug = '/' + slug;
	}

	path.set(slug);
}
