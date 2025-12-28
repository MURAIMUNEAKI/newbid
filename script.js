// 新しい案件生成用プール (タイトルとカテゴリを紐付け)
const POOL_ITEMS = [
    { title: "令和8年1月14日 一般競争入札予定【電子メール入札】(委託：韮崎市立小学校給食調理業務委託）", category: "other" },
    { title: "院内清掃業務委託一式", category: "other" },
    { title: "放射線量測定検査業務委託契約", category: "other" },
    { title: "医療材料等物品管理業務委託 一式", category: "other" },
    { title: "令和8年度流通木材の合法性確認システムに係る運用・保守及びクラウドサービス提供業務", category: "it" },
    { title: "令和8年度国有林野地理情報高度化システム運用・保守業務", category: "it" },
    { title: "令和8年度版「森林へようこそ」の印刷製造・発送支援業務", category: "pr" },
    { title: "新宿御苑コワーキングスペース管理運営事業者の公募について", category: "other" },
    { title: "一般競争入札公告（政府調達）（総合評価落札方式）（次期会計システム構築に関する要件定義等及び調達支援業務）", category: "it" },
    { title: "（一般競争入札公告）入退室管理(顔認証・ICカード装置)及び監視カメラ装置工事（健都）", category: "construction" },
    { title: "ICGC-ARGOからの転送データに関わるデータ保管用データカートリッジ 一式", category: "it" },
    { title: "CT映像およびアンギオハイブリット手術室を用いた医療機器の性能および安全性試験(2回目） 一式", category: "other" },
    { title: "大阪・関西万博に向けたイベント企画・運営業務", category: "event" },
    { title: "地域商店街活性化イベント実施支援業務", category: "event" },
    { title: "市庁舎改修に伴う電気設備工事", category: "construction" },
    { title: "観光地域づくり法人（DMO）等に対する観光地経営改善等の支援業務", category: "tourism" },
    { title: "映像コンテンツを活用した観光プロモーション事業", category: "pr" }
];

const POOL_AGENCIES = ["林野庁", "観光庁", "国土交通省", "デジタル庁", "環境省", "厚生労働省", "韮崎市", "国立病院機構", "東京都", "大阪府"];

document.addEventListener('DOMContentLoaded', () => {
    // 日付フォーマット関数 (YYYY-MM-DD)
    const formatDate = (date) => date.toISOString().split('T')[0];

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // モックデータ: 実在する案件データを使用
    const MOCK_DATA = [
        {
            title: "令和8年度流通木材の合法性確認システムに係る運用・保守及びクラウドサービス提供業務",
            category: "it",
            agency: "林野庁",
            date: formatDate(today)
        },
        {
            title: "令和8年度国有林野地理情報高度化システム運用・保守業務",
            category: "it",
            agency: "林野庁",
            date: formatDate(today)
        },
        {
            title: "令和8年度版「森林へようこそ」の印刷製造・発送支援業務",
            category: "pr",
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
            title: "大阪・関西万博に向けたイベント企画・運営業務",
            category: "event",
            agency: "経済産業省",
            date: formatDate(yesterday)
        },
        {
            title: "市庁舎改修に伴う電気設備工事",
            category: "construction",
            agency: "横浜市",
            date: formatDate(yesterday)
        }
    ];

    const listContainer = document.getElementById('bid-list');
    const tabs = document.querySelectorAll('.tab');
    let currentCategory = 'all';

    // カテゴリごとの検索クエリ定義 (ヒットしやすいように調整)
    const CATEGORY_SEARCH_URLS = {
        'it': 'https://www.kkj.go.jp/s/?X=検索&ti=システム%20OR%20アプリ%20OR%20Web%20OR%20AI%20OR%20ネットワーク',
        'tourism': 'https://www.kkj.go.jp/s/?X=検索&ti=観光%20OR%20インバウンド%20OR%20旅行',
        'event': 'https://www.kkj.go.jp/s/?X=検索&ti=イベント%20OR%20展示会%20OR%20運営',
        'pr': 'https://www.kkj.go.jp/s/?X=検索&ti=広報%20OR%20広告%20OR%20動画%20OR%20パンフレット',
        'construction': 'https://www.kkj.go.jp/s/?X=検索&ti=工事%20OR%20建築%20OR%20改修%20OR%20設備',
        'other': 'https://www.kkj.go.jp/s/?X=検索&ti=委託%20OR%20調達%20OR%20購入'
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

        // 対策: 検索ヒット率向上のため、記号を除去し「件名(ti)」ではなく「キーワード(S)」検索を使用
        // (厳密なタイトル一致だと、少しの違いで0件になるため)
        const sanitizedTitle = item.title
            .replace(/[【】（）「」()\[\]]/g, ' ') // 記号をスペースに置換
            .replace(/\s+/g, ' ')             // 連続するスペースを詰める
            .trim();

        const searchUrl = `https://www.kkj.go.jp/s/?X=検索&S=${encodeURIComponent(sanitizedTitle)}`;

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

        // 重複しないタイトルが見つかるまで試行
        let selectedItem = null;
        for (let i = 0; i < 5; i++) {
            const candidate = POOL_ITEMS[Math.floor(Math.random() * POOL_ITEMS.length)];
            if (!existingTitles.includes(candidate.title)) {
                selectedItem = candidate;
                break;
            }
        }

        // 重複しないものが見つからなかった場合は今回は追加を見送る
        if (!selectedItem) return;

        // 代理店はランダムのまま
        const randomAgency = POOL_AGENCIES[Math.floor(Math.random() * POOL_AGENCIES.length)];
        const today = new Date().toISOString().split('T')[0];

        const newItem = {
            title: selectedItem.title,
            category: selectedItem.category, // 固定された正しいカテゴリを使用
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
            'it': 'IT・デジタル',
            'tourism': '観光',
            'event': 'イベント',
            'pr': '広報',
            'construction': '工事',
            'other': 'その他'
        };
        return map[cat] || 'その他';
    }
});
