import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const posts = await getCollection('blog', ({ data }) => {
		// Drafts render in dev so they can be previewed, but never in a prod build.
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	return rss({
		title: 'rioja',
		description: 'Thoughts on economics, technology, and strategy.',
		site: context.site!,
		items: posts
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
			.map((post) => ({
				title: post.data.title,
				pubDate: post.data.pubDate,
				description: post.data.description,
				link: `/blog/${post.slug}/`,
			})),
	});
}
