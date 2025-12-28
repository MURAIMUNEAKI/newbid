// 日付フォーマット関数 (YYYY-MM-DD)
const formatDate = (date) => date.toISOString().split('T')[0];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const dayBeforeYesterday = new Date(today);
dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

// モックデータ: 参照サイトの検索結果をシミュレート (日付は動的に設定)
const MOCK_DATA = [
    {
        title: "令和6年度 動画コンテンツ制作業務の委託",
        category: "video",
        agency: "東京都",
        date: formatDate(today),
        url: "https://www.kkj.go.jp/s/?X=検索&ti=動画コンテンツ制作業務の委託"
    },
    {
        title: "AIチャットボット導入に係るシステム構築業務",
        category: "ai",
        agency: "経済産業省",
        date: formatDate(today),
        url: "https://www.kkj.go.jp/s/?X=検索&ti=AIチャットボット導入に係るシステム構築業務"
    },
    {
        title: "庁内ネットワーク機器の更新及び保守業務",
        category: "network",
        agency: "大阪府",
        date: formatDate(yesterday),
        url: "https://www.kkj.go.jp/s/?X=検索&ti=庁内ネットワーク機器の更新及び保守業務"
    },
    {
        title: "次世代Webサイトリニューアル事業",
        category: "web",
        agency: "文部科学省",
        date: formatDate(yesterday),
        url: "https://www.kkj.go.jp/s/?X=検索&ti=次世代Webサイトリニューアル事業"
    },
    {
        title: "DX推進に向けた業務システム開発",
        category: "system",
        agency: "横浜市",
        date: formatDate(yesterday),
        url: "https://www.kkj.go.jp/s/?X=検索&ti=DX推進に向けた業務システム開発"
    },
    {
        title: "地域観光資源を活用したインバウンド誘致事業",
        category: "tourism",
        agency: "観光庁",
        date: formatDate(today),
        url: "https://www.kkj.go.jp/s/?X=検索&ti=地域観光資源を活用したインバウンド誘致事業"
    }
];

// 新しい案件をランダム生成するためのデータプール
const POOL_TITLES = [
    "プロモーション動画制作",
    "クラウド基盤構築および移行支援",
    "ホームページアクセシビリティ対応",
    "生成AI活用実証実験業務",
    "セキュリティ診断および対策業務",
    "基幹システム改修業務",
    "SNS運用代行および分析業務",
    "観光プロモーション等の企画・運営業務",
    "観光マーケティング調査業務"
];

const POOL_AGENCIES = ["国土交通省", "環境省", "渋谷区", "福岡市", "防衛省", "デジタル庁", "観光庁"];
const POOL_CATEGORIES = ["web", "system", "ai", "network", "video", "tourism"];

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('bid-list');
    const tabs = document.querySelectorAll('.tab');
    let currentCategory = 'all';

    // カテゴリごとの検索クエリ定義 (ヒットしやすいように調整)
    const CATEGORY_SEARCH_URLS = {
        'web': 'https://www.kkj.go.jp/s/?X=検索&ti=Web%20OR%20ホームページ%20OR%20制作',
        'system': 'https://www.kkj.go.jp/s/?X=検索&ti=システム%20OR%20開発%20OR%20改修',
        'ai': 'https://www.kkj.go.jp/s/?X=検索&ti=AI%20OR%20人工知能%20OR%20チャットボット',
        'network': 'https://www.kkj.go.jp/s/?X=検索&ti=ネットワーク%20OR%20サーバ%20OR%20保守',
        'video': 'https://www.kkj.go.jp/s/?X=検索&ti=動画%20OR%20コンテンツ%20OR%20映像',
        'tourism': 'https://www.kkj.go.jp/s/?X=検索&ti=観光%20OR%20インバウンド%20OR%20プロモーション'
    };

    // 初期表示
    renderList(MOCK_DATA);

    // タブ切り替え機能
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // アクティブクラスの切り替え
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // カテゴリフィルタリング
            currentCategory = tab.dataset.category;
            filterAndRender(currentCategory);
        });
    });

    // 「常に出る」をシミュレートする自動更新機能 (5秒ごとに新しい案件を追加)
    setInterval(() => {
        addNewItem();
    }, 5000);

    function filterAndRender(category) {
        // 現在のDOMにあるアイテムを取得してフィルタリングするのは複雑になるため、
        // 本来は全データを保持している配列からフィルタリングする。
        // ここではデモとして、既存のMOCK_DATA + 追加されたデータで再描画する簡易実装とする。
        // (簡易化のため、全データを保持する変数は作らず、DOM操作で完結させるが、
        //  より堅牢にするには global `allBids` array を管理するのが良い)

        // 今回はシンプルに、表示中のアイテムの display を切り替える
        const items = document.querySelectorAll('.bid-item');
        items.forEach(item => {
            const itemCat = item.dataset.category;
            if (category === 'all' || itemCat === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function renderList(data) {
        listContainer.innerHTML = '';
        data.forEach(item => {
            const el = createBidItem(item);
            listContainer.appendChild(el);
        });
    }

    function createBidItem(item) {
        const li = document.createElement('li');
        li.className = 'bid-item';
        li.dataset.category = item.category; // フィルタリング用

        // カテゴリラベルの表示名変換
        const catLabel = getCategoryLabel(item.category);

        // リンク先の生成: 個別タイトルではなく、カテゴリ全体の検索結果に飛ばすことで「見つかりません」を防ぐ
        // もしitem.urlが指定されていればそれを使うが、今回は動的に上書きするポリシーに変更
        const searchUrl = CATEGORY_SEARCH_URLS[item.category] || 'https://www.kkj.go.jp/s/';

        li.innerHTML = `
            <a href="${searchUrl}" class="bid-title" target="_blank">${item.title}</a>
            <div class="bid-meta">
                <span class="meta-item"><span class="tag">${catLabel}</span></span>
                <span class="meta-item">🏢 ${item.agency}</span>
                <span class="meta-item">📅 ${item.date}</span>
                <span class="meta-item" style="font-size: 0.8em; color: #94a3b8;">🔗 関連公募を検索 -></span>
            </div>
        `;
        return li;
    }

    function addNewItem() {
        // ランダムな新しい案件を作成
        const randomTitle = POOL_TITLES[Math.floor(Math.random() * POOL_TITLES.length)];
        const randomAgency = POOL_AGENCIES[Math.floor(Math.random() * POOL_AGENCIES.length)];
        const randomCategory = POOL_CATEGORIES[Math.floor(Math.random() * POOL_CATEGORIES.length)];
        const today = new Date().toISOString().split('T')[0];

        const newItem = {
            title: `【新着】${randomTitle}`,
            category: randomCategory,
            agency: randomAgency,
            date: today,
            // url: URLはcreateBidItem内でカテゴリに基づいて生成されるため省略可
        };

        const el = createBidItem(newItem);

        // リストの先頭に追加
        listContainer.insertBefore(el, listContainer.firstChild);

        // 現在のフィルタ条件に合わなければ隠す
        if (currentCategory !== 'all' && currentCategory !== newItem.category) {
            el.style.display = 'none';
        }

        // アニメーション効果 (CSS class contains animation)

        // 項目が増えすぎないように古いものを削除 (オプション)
        if (listContainer.children.length > 50) {
            listContainer.removeChild(listContainer.lastChild);
        }
    }

    function getCategoryLabel(cat) {
        const map = {
            'web': 'Web制作',
            'system': 'システム開発',
            'ai': 'AI・人工知能',
            'network': 'ネットワーク',
            'video': '動画制作',
            'tourism': '観光'
        };
        return map[cat] || 'その他';
    }
});
