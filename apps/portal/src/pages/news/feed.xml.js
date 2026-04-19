import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

/**
 * /news/feed.xml — RSS 2.0 feed of every news article, newest-first.
 * Emitted at build time by @astrojs/rss.
 */
export async function GET(context) {
  const news = (await getCollection('news')).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  return rss({
    title: 'Government of Ghana — News',
    description:
      'Announcements, speeches, policy updates, and publications from across government.',
    site: context.site,
    items: news.map((entry) => ({
      title: entry.data.title,
      description: entry.data.lede,
      pubDate: entry.data.publishedAt,
      link: `/news/${entry.data.publishedAt.getFullYear()}/${entry.slug}/`,
      categories: entry.data.topics,
      author: `${entry.data.author}`,
    })),
    customData: '<language>en-gh</language>',
    stylesheet: false,
  });
}
