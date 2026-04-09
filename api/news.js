export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const gn = (q, cat) => ({
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ja&gl=JP&ceid=JP:ja`,
    source: 'Google News',
    category: cat
  });

  const feeds = [
    // 官公庁・行政
    { url: 'https://www.mlit.go.jp/report/press/house07_hh_000001.rss', source: '国土交通省', category: 'law' },
    { url: 'https://www.mlit.go.jp/report/press/totikensangyo16_hh_000001.rss', source: '国土交通省（土地）', category: 'law' },
    { url: 'https://www.mlit.go.jp/report/press/house04_hh_000001.rss', source: '国土交通省（住宅局）', category: 'law' },
    // 業界団体・専門メディア
    { url: 'https://www.retpc.jp/feed/', source: '不動産流通推進センター', category: 'news' },
    { url: 'https://www.jpm.jp/feed/', source: '日本賃貸住宅管理協会', category: 'news' },
    { url: 'https://www.re-port.net/rss/news.rdf', source: 'R.E.port', category: 'news' },
    { url: 'https://www.jutaku-s.com/rss/all.xml', source: '住宅新報', category: 'news' },
    { url: 'https://www.jutaku-s.com/rss/chintai.xml', source: '住宅新報（賃貸）', category: 'news' },
    { url: 'https://www.jutaku-s.com/rss/law.xml', source: '住宅新報（法律）', category: 'law' },
    { url: 'https://www.zenchin.com/rss/news.xml', source: '全国賃貸住宅新聞', category: 'news' },
    { url: 'https://www.ielove-cloud.jp/blog/feed/', source: 'いえらぶコラム', category: 'news' },
    // Yahoo!ニュース
    { url: 'https://news.yahoo.co.jp/rss/topics/realestate.xml', source: 'Yahoo!ニュース（不動産）', category: 'market' },
    { url: 'https://news.yahoo.co.jp/rss/topics/business.xml', source: 'Yahoo!ニュース（ビジネス）', category: 'news' },
    // 法律・規制
    gn('賃貸住宅管理業法', 'law'),
    gn('借地借家法 改正', 'law'),
    gn('賃貸 管理会社 規制', 'law'),
    gn('原状回復 賃貸', 'law'),
    gn('住宅セーフティネット法 改正', 'law'),
    gn('空き家 法律 賃貸', 'law'),
    gn('敷金 礼金 法改正', 'law'),
    gn('定期借家 法律', 'law'),
    gn('宅地建物取引業法 改正', 'law'),
    gn('建築基準法 賃貸 改正', 'law'),
    gn('重要事項説明 電子化 不動産', 'law'),
    gn('不動産 行政処分', 'law'),
    gn('賃貸 消費者保護 法律', 'law'),
    gn('住宅扶助 生活保護 賃貸', 'law'),
    // 業界ニュース
    gn('賃貸住宅 業界 ニュース', 'news'),
    gn('賃貸 電子契約 DX', 'news'),
    gn('家賃債務保証 賃貸', 'news'),
    gn('サービス付き高齢者向け住宅', 'news'),
    gn('大東建託 賃貸', 'news'),
    gn('レオパレス21 賃貸', 'news'),
    gn('大和ハウス 賃貸 管理', 'news'),
    gn('積水ハウス 賃貸', 'news'),
    gn('賃貸 外国人 入居', 'news'),
    gn('賃貸 物件管理 AI', 'news'),
    gn('賃貸 リノベーション', 'news'),
    gn('不動産テック 賃貸', 'news'),
    gn('賃貸 民泊 シェアハウス', 'news'),
    gn('単身 賃貸 ワンルーム', 'news'),
    gn('賃貸 仲介 手数料', 'news'),
    gn('賃貸 退去 トラブル', 'news'),
    gn('賃貸 家賃 値上げ', 'news'),
    gn('賃貸 管理会社 プレスリリース', 'news'),
    gn('賃貸 ペット可 物件', 'news'),
    gn('アパート 管理 経営', 'news'),
    gn('賃貸 保証人 廃止', 'news'),
    gn('賃貸 IoT スマートホーム', 'news'),
    gn('不動産 賃貸 人口減少 空き家', 'news'),
    gn('賃貸 成約 仲介 統計', 'news'),
    gn('マンション 賃貸 供給 新築', 'news'),
    // 市場動向
    gn('賃貸 空室率 家賃 市場', 'market'),
    gn('不動産 賃貸 市場動向 2026', 'market'),
    gn('賃貸住宅 需給 統計', 'market'),
    gn('地価 公示 住宅', 'market'),
    gn('首都圏 賃貸 家賃 推移', 'market'),
    gn('大阪 名古屋 賃貸 市場', 'market'),
    gn('賃貸 需要 供給 分析', 'market'),
    gn('不動産 投資 賃貸 利回り', 'market'),
    gn('賃貸 人口動態 移住', 'market'),
    gn('住宅 着工 統計 国土交通', 'market'),
    // 資格・試験
    gn('宅建 試験 合格 2026', 'license'),
    gn('宅地建物取引士 試験 問題', 'license'),
    gn('不動産鑑定士 試験 合格', 'license'),
    gn('管理業務主任者 試験 合格', 'license'),
    gn('マンション管理士 試験 合格', 'license'),
    gn('賃貸不動産経営管理士 試験', 'license'),
    gn('不動産 資格 試験 合格率', 'license'),
    gn('土地家屋調査士 試験', 'license'),
    gn('FP ファイナンシャルプランナー 不動産', 'license'),
    gn('不動産 資格 難易度 受験 勉強', 'license'),
  ];

  const fetchFeed = async (feed) => {
    try {
      const response = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RentalNewsBot/1.0)' },
        signal: AbortSignal.timeout(4000)
      });
      if (!response.ok) return [];
      const xml = await response.text();
      const items = xml.match(/<item[\s\S]*?<\/item>/g) || [];
      const results = [];
      for (const item of items.slice(0, 8)) {
        const title = decodeEntities(extract(item, 'title'));
        const link = extract(item, 'link') || extract(item, 'guid');
        const pubDate = extract(item, 'pubDate');
        const rawDesc = extract(item, 'description') || '';
        const description = stripTags(decodeEntities(stripTags(rawDesc)))
          .replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
        if (!title) continue;
        const parsedDate = pubDate ? new Date(pubDate) : new Date();
        results.push({
          title: title.slice(0, 80),
          summary: description.slice(0, 120) || '',
          category: feed.category,
          source: feed.source,
          date: formatDate(parsedDate),
          rawDate: parsedDate.toISOString(),
          readMin: 1,
          url: link || ''
        });
      }
      return results;
    } catch (e) {
      return [];
    }
  };

  const settled = await Promise.allSettled(feeds.map(fetchFeed));
  const articles = settled.flatMap(r => r.status === 'fulfilled' ? r.value : []);

  const relevantKeywords = [
    '賃貸', '不動産', '管理会社', '管理業', '借家', '借地', '家賃', '敷金', '礼金',
    '入居', '退去', '原状回復', '空室', '物件', '住宅', 'マンション', 'アパート',
    '管理組合', '仲介', '宅建', '宅地建物', '国土交通', '住宅セーフティネット',
    '保証会社', '賃借', 'オーナー', '大家', '建物管理', 'サ高住', '高齢者住宅',
    '定期借家', 'いえらぶ', 'レオパレス', '大東建託', '積水ハウス', '大和ハウス',
    '住宅新報', '全国賃貸', '不動産流通', '賃貸管理', '不動産テック',
    'リノベーション', '民泊', 'シェアハウス', 'ワンルーム', '空き家', '建築基準',
    '重要事項説明', '仲介手数料', '保証人', '管理業務主任者', 'マンション管理士',
    '賃貸不動産経営管理士', '不動産鑑定士', '土地家屋調査士', '地価', '着工',
    '空室率', '利回り', 'FP', 'ファイナンシャルプランナー',
  ];

  const isRelevant = (article) => {
    const text = article.title + (article.summary || '');
    return relevantKeywords.some(kw => text.includes(kw));
  };

  const seen = new Set();
  const unique = articles.filter(a => {
    if (seen.has(a.title)) return false;
    seen.add(a.title);
    return true;
  });

  const sorted = unique
    .filter(isRelevant)
    .sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0))
    .slice(0, 150);

  res.status(200).json({ articles: sorted, fetchedAt: new Date().toISOString() });
}

function extract(xml, tag) {
  const m = xml.match(new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></' + tag + '>'))
    || xml.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>'));
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
  return (d.getMonth() + 1) + '/' + d.getDate();
}
