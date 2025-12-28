// 日付フォーマット関数 (YYYY-MM-DD)
const formatDate = (date) => date.toISOString().split('T')[0];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const dayBeforeYesterday = new Date(today);
dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

// モックデータ: 実在する案件データを使用 (ピンポイント検索を成功させるため)
const MOCK_DATA = [
    {
        title: "令和8年度流通木材の合法性確認システムに係る運用・保守及びクラウドサービス提供業務",
        category: "system",
        agency: "林野庁",
        date: formatDate(today)
    },
    {
        title: "令和8年度国有林野地理情報高度化システム運用・保守業務",
        category: "web",
        agency: "林野庁",
        date: formatDate(today)
    },
    {
        title: "令和8年度版「森林へようこそ」の印刷製造・発送支援業務",
        category: "tourism",
        agency: "林野庁",
        date: formatDate(today)
    },
    {
        title: "観光地域づくり法人（DMO）等に対する観光地経営改善等の支援業務",
        category: "tourism",
        agency: "観光庁",
        date: formatDate(yesterday)
    },
    {
        title: "映像コンテンツを活用した観光プロモーション事業",
        category: "video",
        agency: "地方自治体",
        date: formatDate(yesterday)
    }
];

// 新しい案件生成用プール (実在しそうな名称パターンを使用 - 拡大版)
const POOL_TITLES = [
    "令和8年1月14日 一般競争入札予定【電子メール入札】(委託：韮崎市立小学校給食調理業務委託）",
    "院内清掃業務委託一式",
    "放射線量測定検査業務委託契約",
    "医療材料等物品管理業務委託 一式",
    "令和8年度流通木材の合法性確認システムに係る運用・保守及びクラウドサービス提供業務",
    "令和8年度国有林野地理情報高度化システム運用・保守業務",
    "令和8年度版「森林へようこそ」の印刷製造・発送支援業務",
    "新宿御苑コワーキングスペース管理運営事業者の公募について",
    "一般競争入札公告（政府調達）（総合評価落札方式）（次期会計システム構築に関する要件定義等及び調達支援業務）",
    "（一般競争入札公告）入退室管理(顔認証・ICカード装置)及び監視カメラ装置工事（健都）",
    "ICGC-ARGOからの転送データに関わるデータ保管用データカートリッジ 一式",
    "CT映像およびアンギオハイブリット手術室を用いた医療機器の性能および安全性試験(2回目） 一式",
    "Taurocholic acid 3-sulfate 一式",
    "シングルセル用ライブラリー作製試薬 一式",
    "病院棟1階薬剤部什器 一式"
];

const POOL_AGENCIES = ["林野庁", "観光庁", "国土交通省", "デジタル庁", "環境省", "厚生労働省"];
const POOL_CATEGORIES = ["system", "web", "tourism", "video", "network", "ai"];

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

    // 「常に出る」をシミュレートする自動更新機能 (更新間隔を8秒に緩和)
    setInterval(() => {
        addNewItem();
    }, 8000);

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
        li.dataset.title = item.title; // 重複チェック用

        // カテゴリラベルの表示名変換
        const catLabel = getCategoryLabel(item.category);

        // 対策: 案件名(ti)でのピンポイント検索URLを生成
        // 官公需ポータルサイトの仕様に合わせてパラメータを設定
        const searchUrl = `https://www.kkj.go.jp/s/?X=検索&ti=${encodeURIComponent(item.title)}`;

        li.innerHTML = `
            <a href="${searchUrl}" class="bid-title" target="_blank">${item.title}</a>
            <div class="bid-meta">
                <span class="meta-item"><span class="tag">${catLabel}</span></span>
                <span class="meta-item">🏢 ${item.agency}</span>
                <span class="meta-item">📅 ${item.date}</span>
                <span class="meta-item" style="font-size: 0.8em; color: #94a3b8;">🔍 ピンポイント検索</span>
            </div>
        `;
        return li;
    }

    function addNewItem() {
        // 現在表示されているタイトルのリストを取得（重複チェック用）
        const existingTitles = Array.from(document.querySelectorAll('.bid-item')).map(el => el.dataset.title);

        // 重複しないタイトルが見つかるまで試行（最大5回）
        let randomTitle = null;
        for (let i = 0; i < 5; i++) {
            const candidate = POOL_TITLES[Math.floor(Math.random() * POOL_TITLES.length)];
            if (!existingTitles.includes(candidate)) {
                randomTitle = candidate;
                break;
            }
        }

        // 重複しないものが見つからなかった場合は今回は追加を見送る
        if (!randomTitle) return;

        const randomAgency = POOL_AGENCIES[Math.floor(Math.random() * POOL_AGENCIES.length)];
        const randomCategory = POOL_CATEGORIES[Math.floor(Math.random() * POOL_CATEGORIES.length)];
        const today = new Date().toISOString().split('T')[0];

        const newItem = {
            title: randomTitle,
            category: randomCategory,
            agency: randomAgency,
            date: today
        };

        const el = createBidItem(newItem);

        // リストの先頭に追加
        listContainer.insertBefore(el, listContainer.firstChild);

        // 現在のフィルタ条件に合わなければ隠す
        if (currentCategory !== 'all' && currentCategory !== newItem.category) {
            el.style.display = 'none';
        }

        // アニメーション効果を追加
        el.animate([
            { opacity: 0, transform: 'translateY(-20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], {
            duration: 500,
            easing: 'ease-out'
        });

        // 項目が増えすぎないように古いものを削除
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
