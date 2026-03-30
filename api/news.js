export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const feeds = [
    {
      url: 'https://www.mlit.go.jp/report/press/house07_hh_000001.rss',
      source: '国土交通省',
      category: 'law'
    },
    {
      url: 'https://www.retpc.jp/feed/',
      source: '不動産流通推進センター',
      category: 'news'
    },
    {
      url: 'https://www.jpm.jp/feed/',
      source: '日本賃貸住宅管理協会',
      category: 'news'
    },
    {
      url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8+%E7%AE%A1%E7%90%86%E4%BC%9A%E7%A4%BE+%E8%A6%8F%E5%88%B6&hl=ja&gl=JP&ceid=JP:ja',
      source: 'Google News',
      category: 'law'
    },
    {
      url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8%E4%BD%8F%E5%AE%85+%E6%A5%AD%E7%95%8C+%E5%B8%82%E5%A0%B4&hl=ja&gl=JP&ceid=JP:ja',
      source: 'Google News',
      category: 'news'
    }
  ];

  const articles = [];

  for (const feed of feeds) {
    try {
      const response = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RentalNewsBot/1.0)' },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) continue;
      const xml = await response.text();

      const items = xml.match(/<item[\s\S]*?<\/item>/g) || [];
      for (const item of items.slice(0, 5)) {
        const title = decodeEntities(extract(item, 'title'));
        const link = extract(item, 'link') || extract(item, 'guid');
        const pubDate = extract(item, 'pubDate');
        const description = decodeEntities(stripTags(extract(item, 'description') || ''));

        if (!title) continue;

        const date = pubDate ? formatDate(new Date(pubDate)) : formatDate(new Date());
        articles.push({
          title: title.slice(0, 80),
          summary: description.slice(0, 120) || 'クリックして詳細をご確認ください。',
          category: feed.category,
          source: feed.source,
          date,
          readMin: 1,
          url: link || ''
        });
      }
    } catch (e) {
      // skip failed feed
    }
  }

  // Deduplicate by title
  const seen = new Set();
  const unique = articles.filter(a => {
    if (seen.has(a.title)) return false;
    seen.add(a.title);
    return true;
  });

  // Sort by date desc, limit 20
  const sorted = unique.slice(0, 20);

  res.status(200).json({ articles: sorted, fetchedAt: new Date().toISOString() });
}

function extract(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`))
    || xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : '';
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

function formatDate(d) {
  if (isNaN(d.getTime())) return '';
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
