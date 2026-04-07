export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const feeds = [
    // 官公庁・行政
    { url: 'https://www.mlit.go.jp/report/press/house07_hh_000001.rss', source: '国土交通省', category: 'law' },
    { url: 'https://www.mlit.go.jp/report/press/totikensangyo16_hh_000001.rss', source: '国土交通省（土地）', category: 'law' },
    { url: 'https://www.mlit.go.jp/report/press/house04_hh_000001.rss', source: '国土交通省（住宅局）', category: 'law' },
    // 業界団体
    { url: 'https://www.retpc.jp/feed/', source: '不動産流通推進センター', category: 'news' },
    { url: 'https://www.jpm.jp/feed/', source: '日本賃貸住宅管理協会', category: 'news' },
    // 不動産専門メディア
    { url: 'https://www.re-port.net/rss/news.rdf', source: 'R.E.port', category: 'news' },
    { url: 'https://www.jutaku-s.com/rss/all.xml', source: '住宅新報', category: 'news' },
    { url: 'https://www.jutaku-s.com/rss/chintai.xml', source: '住宅新報（賃貸）', category: 'news' },
    { url: 'https://www.jutaku-s.com/rss/law.xml', source: '住宅新報（法律）', category: 'law' },
    { url: 'https://www.zenchin.com/rss/news.xml', source: '全国賃貸住宅新聞', category: 'news' },
    { url: 'https://www.ielove-cloud.jp/blog/feed/', source: 'いえらぶコラム', category: 'news' },
    // Yahoo!ニュース
    { url: 'https://news.yahoo.co.jp/rss/topics/realestate.xml', source: 'Yahoo!ニュース（不動産）', category: 'news' },
    { url: 'https://news.yahoo.co.jp/rss/topics/business.xml', source: 'Yahoo!ニュース（ビジネス）', category: 'news' },
    // Google News（法律・規制）
    { url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8%E4%BD%8F%E5%AE%85%E7%AE%A1%E7%90%86%E6%A5%AD%E6%B3%95&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'law' },
    { url: 'https://news.google.com/rss/search?q=%E5%80%9F%E5%9C%B0%E5%80%9F%E5%AE%B6%E6%B3%95+%E6%94%B9%E6%AD%A3&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'law' },
    { url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8+%E7%AE%A1%E7%90%86%E4%BC%9A%E7%A4%BE+%E8%A6%8F%E5%88%B6&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'law' },
    { url: 'https://news.google.com/rss/search?q=%E5%8E%9F%E7%8A%B6%E5%9B%9E%E5%BE%A9+%E8%B3%83%E8%B2%B8&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'law' },
    { url: 'https://news.google.com/rss/search?q=%E4%BD%8F%E5%AE%85%E3%82%BB%E3%83%BC%E3%83%95%E3%83%86%E3%82%A3%E3%83%8D%E3%83%83%E3%83%88+%E6%B3%95%E6%94%B9%E6%AD%A3&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'law' },
    { url: 'https://news.google.com/rss/search?q=%E7%A9%BA%E3%81%8D%E5%AE%B6+%E6%B3%95%E5%BE%8B+%E8%B3%83%E8%B2%B8&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'law' },
    { url: 'https://news.google.com/rss/search?q=%E6%95%B7%E9%87%91+%E7%A4%BC%E9%87%91+%E6%B3%95%E6%94%B9%E6%AD%A3&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'law' },
    // Google News（業界ニュース）
    { url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8%E4%BD%8F%E5%AE%85+%E6%A5%AD%E7%95%8C+%E5%B8%82%E5%A0%B4&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8+%E7%A9%BA%E5%AE%A4%E7%8E%87+%E5%AE%B6%E8%B3%83&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E4%B8%8D%E5%8B%95%E7%94%A3+%E8%B3%83%E8%B2%B8+%E3%83%86%E3%82%AF%E3%83%8E%E3%83%AD%E3%82%B8%E3%83%BC&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8+%E9%9B%BB%E5%AD%90%E5%A5%91%E7%B4%84+DX&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E5%AE%B6%E8%B3%83%E5%82%B5%E5%8B%99%E4%BF%9D%E8%A8%BC+%E8%B3%83%E8%B2%B8&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E4%BB%98%E3%81%8D%E9%AB%98%E9%BD%A2%E8%80%85%E5%90%91%E3%81%91%E4%BD%8F%E5%AE%85&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E5%A4%A7%E6%9D%B1%E5%BB%BA%E8%A8%AD+%E8%B3%83%E8%B2%B8&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E3%83%AC%E3%82%AA%E3%83%91%E3%83%AC%E3%82%B9+%E8%B3%83%E8%B2%B8&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8+%E5%A4%96%E5%9B%BD%E4%BA%BA+%E5%85%A5%E5%B1%85&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8+%E7%89%A9%E4%BB%B6%E7%AE%A1%E7%90%86+AI&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E4%B8%8D%E5%8B%95%E7%94%A3+%E8%B3%83%E8%B2%B8+%E5%B8%82%E5%A0%B4%E5%8B%95%E5%90%91+2026&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
    { url: 'https://news.google.com/rss/search?q=%E8%B3%83%E8%B2%B8+%E7%AE%A1%E7%90%86%E4%BC%9A%E7%A4%BE+%E3%83%97%E3%83%AC%E3%82%B9&hl=ja&gl=JP&ceid=JP:ja', source: 'Google News', category: 'news' },
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

        const parsedDate = pubDate ? new Date(pubDate) : new Date();
        const date = formatDate(parsedDate);
        articles.push({
          title: title.slice(0, 80),
          summary: description.slice(0, 120) || 'クリックして詳細をご確認ください。',
          category: feed.category,
          source: feed.source,
          date,
          rawDate: parsedDate.toISOString(),
          readMin: 1,
          url: link || ''
        });
      }
    } catch (e) {
      // skip failed feed
    }
  }

  // 賃貸・不動産関連キーワードフィルター
  const relevantKeywords = [
    '賃貸', '不動産', '管理会社', '管理業', '借家', '借地', '家賃', '敷金', '礼金',
    '入居', '退去', '原状回復', '空室', '物件', '住宅', 'マンション', 'アパート',
    '管理組合', '仲介', '宅建', '国土交通', '住宅セーフティネット', '保証会社',
    '賃借', 'オーナー', '大家', '建物管理', 'サ高住', '高齢者住宅', '定期借家',
    'いえらぶ', 'suumo', 'アットホーム', 'レオパレス', '大東建託', '積水ハウス',
    '住宅新報', '全国賃貸', 'R.E.port', '不動産流通', '賃貸管理'
  ];

  const isRelevant = (article) => {
    const text = (article.title + article.summary).toLowerCase();
    return relevantKeywords.some(kw => text.includes(kw));
  };

  // Deduplicate by title
  const seen = new Set();
  const unique = articles.filter(a => {
    if (seen.has(a.title)) return false;
    seen.add(a.title);
    return true;
  });

  // 関連記事のみに絞り込み → 最新順 → 上限100件
  const sorted = unique
    .filter(isRelevant)
    .sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0))
    .slice(0, 100);

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
