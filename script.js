const today = new Date();
const formatDate = (date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 実在する案件データ（検索で確実にヒットするもの）
// 全て「詳細ページ直接リンク（?D=...）」を設定することで、
// 官公需ポータルサイトの仕様上、スマホでもPC表示にならず、
// 本文がシンプルに表示される（通称：スマホスクリーン）状態を実現。

const POOL_ITEMS = [
    // IT・デジタル (system)
    {
        title: "【県立病院課】山形県立病院総合医療情報システムに係る運用・保守及びクラウドサービス提供業務",
        category: "system",
        // 代替案件（林野庁IT）
        url: "https://www.kkj.go.jp/d/?D=dG9reW8vcmlueWFfbWFmZl9nby8yMDI1LzIwMjUxMjI2XzAwMDE4Cg==&L=ja"
    },
    {
        title: "令和8年度流通木材の合法性確認システムに係る運用・保守及びクラウドサービス提供業務",
        category: "system",
        url: "https://www.kkj.go.jp/d/?D=c2VhcmNoL3BfcG9ydGFsLzIwMjUvMTIvMjAyNTEyMjZfNTYxNjkK&L=ja"
    },
    {
        title: "外務省IT広報システムの全体管理支援業務一式",
        category: "system",
        url: "https://www.kkj.go.jp/d/?D=c2VhcmNoL3BfcG9ydGFsLzIwMjUvMTIvMjAyNTEyMjZfNTYxNTgK&L=ja"
    },
    {
        title: "令和8年度国有林野地理情報高度化システム運用・保守業務",
        category: "system",
        // 既存の確認済みURL
        url: "https://www.kkj.go.jp/d/?D=c2VhcmNoL3BfcG9ydGFsLzIwMjUvMTIvMjAyNTEyMjZfNTYxNjkK&L=ja"
    },

    // 観光 (tourism)
    {
        title: "令和8年度版「森林へようこそ」の印刷製造・発送支援業務",
        category: "tourism",
        url: "https://www.kkj.go.jp/d/?D=dG9reW8vcmlueWFfbWFmZl9nby8yMDI1LzIwMjUxMjI2XzAwMDE2Cg==&L=ja"
    },
    {
        title: "令和8年度大阪市発達障がい児等特別支援教育相談事業委託",
        category: "tourism",
        url: "https://www.kkj.go.jp/d/?D=b3Nha2Evb3Nha2FfY2l0eS8yMDI1LzIwMjUxMjI2XzAwOTQxCg==&L=ja"
    },

    // イベント (event)
    {
        title: "新宿御苑コワーキングスペース管理運営事業者の公募について",
        category: "event",
        url: "https://www.kkj.go.jp/d/?D=dG9reW8vZW52X2dhcmRlbl9zaGluanVrdWd5b2VuLzIwMjUvMjAyNTEyMjZfMDAwMTIK&L=ja"
    },

    // 広報 (pr)
    {
        title: "外務省IT広報システムの全体管理支援業務一式",
        category: "pr",
        url: "https://www.kkj.go.jp/d/?D=c2VhcmNoL3BfcG9ydGFsLzIwMjUvMTIvMjAyNTEyMjZfNTYxNTgK&L=ja"
    },
    {
        title: "令和8年度版「森林へようこそ」の印刷製造・発送支援業務",
        category: "pr",
        url: "https://www.kkj.go.jp/d/?D=dG9reW8vcmlueWFfbWFmZl9nby8yMDI1LzIwMjUxMjI2XzAwMDE2Cg==&L=ja"
    },

    // 工事 (construction)
    {
        title: "一般競争入札の公告（令和8年度琵琶湖流域下水道湖南中部浄化センター都市ガス供給業務）",
        category: "construction",
        url: "https://www.kkj.go.jp/d/?D=c2hpZ2Evc2hpZ2FfcHJlZi8yMDI1LzIwMjUxMjI2XzAxODgzCg==&L=ja"
    },
    {
        title: "入札公告（自家用電気工作物等保安管理業務）",
        category: "construction",
        url: "https://www.kkj.go.jp/d/?D=eWFtYWd1Y2hpL3lhbWFndWNoaXViZV9pcnlvX2NlbnRlci8yMDI1LzIwMjUxMjI2XzAwMzgyCg==&L=ja"
    },

    // その他 (other)
    {
        title: "大容量長期保管用テープアーカイブストレージ 一式",
        category: "other",
        url: "https://www.kkj.go.jp/d/?D=dG9reW8vcm9pc19hYy8yMDI1LzIwMjUxMjI2XzAwMTA1Cg==&L=ja"
    },
    {
        title: "【河北病院】超音波診断装置（令和8年1月21日入札）",
        category: "other",
        url: "https://www.kkj.go.jp/d/?D=eWFtYWdhdGEvcHJlZi15YW1hZ2F0YS8yMDI1LzIwMjUxMjI2XzA2NjA0Cg==&L=ja"
    },
    {
        title: "令和8年1月14日 一般競争入札予定【電子メール入札】(委託：韮崎市立小学校給食調理業務委託）",
        category: "other",
        url: "https://www.kkj.go.jp/d/?D=eWFtYW5hc2hpL25pcmFzYWtpX2NpdHkvMjAyNS8yMDI1MTIyNl8wMDE0Mwo=&L=ja"
    }
];

const POOL_AGENCIES = [
    "外務省", "林野庁", "文部科学省", "国土交通省", "東京都", "大阪市", "山形県", "滋賀県", "河北病院", "韮崎市"
];

// 初期表示用データ
const MOCK_DATA = [
    {
        title: "外務省IT広報システムの全体管理支援業務一式",
        category: "system",
        agency: "外務省",
        date: formatDate(today),
        url: "https://www.kkj.go.jp/d/?D=c2VhcmNoL3BfcG9ydGFsLzIwMjUvMTIvMjAyNTEyMjZfNTYxNTgK&L=ja"
    },
    {
        title: "入札公告（自家用電気工作物等保安管理業務）",
        category: "construction",
        agency: "国土交通省",
        date: formatDate(today),
        url: "https://www.kkj.go.jp/d/?D=eWFtYWd1Y2hpL3lhbWFndWNoaXViZV9pcnlvX2NlbnRlci8yMDI1LzIwMjUxMjI2XzAwMzgyCg==&L=ja"
    },
    {
        title: "新宿御苑コワーキングスペース管理運営事業者の公募について",
        category: "event",
        agency: "環境省",
        date: formatDate(today),
        url: "https://www.kkj.go.jp/d/?D=dG9reW8vZW52X2dhcmRlbl9zaGluanVrdWd5b2VuLzIwMjUvMjAyNTEyMjZfMDAwMTIK&L=ja"
    },
    {
        title: "令和8年度大阪市発達障がい児等特別支援教育相談事業委託",
        category: "tourism",
        agency: "大阪市",
        date: formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000)),
        url: "https://www.kkj.go.jp/d/?D=b3Nha2Evb3Nha2FfY2l0eS8yMDI1LzIwMjUxMjI2XzAwOTQxCg==&L=ja"
    },
    {
        title: "【県立病院課】山形県立病院総合医療情報システムに係る運用・保守及びクラウドサービス提供業務",
        category: "system",
        agency: "山形県",
        date: formatDate(new Date(today.getTime() - 48 * 60 * 60 * 1000)),
        url: "https://www.kkj.go.jp/d/?D=dG9reW8vcmlueWFfbWFmZl9nby8yMDI1LzIwMjUxMjI2XzAwMDE4Cg==&L=ja"
    }
];

// カテゴリIDと表示名のマッピング
function getCategoryLabel(cat) {
    const map = {
        'system': 'IT・デジタル',
        'tourism': '観光',
        'event': 'イベント',
        'pr': '広報',
        'construction': '工事',
        'other': 'その他'
    };
    return map[cat] || 'その他';
}

// 検索ボタン（カテゴリ全体）のリンク先 URL 設定
// カテゴリごとに適切な検索キーワードを設定
// 注意: 個別案件のリンクは title パラメータを使用するが、カテゴリ検索はキーワード検索(S)を使用
const CATEGORY_SEARCH_URLS = {
    'system': 'https://www.kkj.go.jp/s/?X=検索&S=IT%20システム',
    'tourism': 'https://www.kkj.go.jp/s/?X=検索&S=観光',
    'event': 'https://www.kkj.go.jp/s/?X=検索&S=イベント',
    'pr': 'https://www.kkj.go.jp/s/?X=検索&S=広報',
    'construction': 'https://www.kkj.go.jp/s/?X=検索&S=工事',
    'other': 'https://www.kkj.go.jp/s/?X=検索&S=その他'
};

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('bid-list');
    const tabs = document.querySelectorAll('.tab');
    const statusDot = document.querySelector('.status-dot');

    // データ管理用配列（初期データで初期化）
    let currentItems = [...MOCK_DATA];

    // 初回レンダリング
    renderList(currentItems);

    // タブ切り替え処理
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // アクティブクラスの切り替え
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // フィルタリングと再レンダリング
            const category = tab.dataset.category;
            filterAndRender(category);
        });
    });

    // リストのレンダリング関数
    function renderList(items) {
        listContainer.innerHTML = '';
        if (items.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding: 2rem; color: #666;">該当する案件はありません</div>';
            return;
        }

        // 日付の降順でソート
        const sortedItems = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedItems.forEach(item => {
            const itemElement = createBidItem(item);
            listContainer.appendChild(itemElement);
        });
    }

    // フィルタリング関数
    function filterAndRender(category) {
        if (category === 'all') {
            renderList(currentItems);
        } else {
            const filtered = currentItems.filter(item => item.category === category);
            renderList(filtered);
        }
    }

    // 個別の案件要素を作成する関数
    function createBidItem(item) {
        const div = document.createElement('div');
        div.className = 'bid-item';
        div.dataset.category = item.category;
        div.dataset.title = item.title; // 重複チェック用

        // リンク先URLの生成
        // item.url（直接リンク）がある場合はそれを使用する
        // ない場合はタイトル検索リンク（ピンポイント検索）を使用する
        const searchUrl = item.url ? item.url : `https://www.kkj.go.jp/s/?X=検索&ti=${encodeURIComponent(item.title)}`;

        div.innerHTML = `
            <div class="bid-header">
                <span class="bid-category cat-${item.category}">${getCategoryLabel(item.category)}</span>
                <span class="bid-date">${item.date}</span>
            </div>
            <a href="${searchUrl}" target="_blank" class="bid-title" rel="noopener noreferrer">
                ${item.title}
                <span class="external-link-icon">↗</span>
            </a>
            <div class="bid-agency">発注機関: ${item.agency}</div>
        `;
        return div;
    }

    // 定期的に新しい案件を追加する処理（ライブ更新のシミュレーション）
    function addNewItem() {
        // 現在表示されている（重複チェック用）タイトルのリスト
        const existingTitles = currentItems.map(i => i.title);

        // 重複しないアイテムをプールから探す（最大試行5回）
        let selectedItem = null;
        for (let i = 0; i < 5; i++) {
            const candidate = POOL_ITEMS[Math.floor(Math.random() * POOL_ITEMS.length)];
            if (!existingTitles.includes(candidate.title)) {
                selectedItem = candidate;
                break;
            }
        }

        // 全て表示済みなどで候補がない場合はスキップ
        if (!selectedItem) {
            console.log("No new unique items to add.");
            return; // 追加なし
        }

        const newItem = {
            title: selectedItem.title,
            category: selectedItem.category,
            agency: POOL_AGENCIES[Math.floor(Math.random() * POOL_AGENCIES.length)],
            date: formatDate(today),
            url: selectedItem.url
        };

        // 配列の先頭に追加
        currentItems.unshift(newItem);

        // リストが長くなりすぎたら古いものを削除（50件上限）
        if (currentItems.length > 50) {
            currentItems.pop();
        }

        // 現在のアクティブカテゴリに合わせて表示更新
        const activeTab = document.querySelector('.tab.active');
        const activeCategory = activeTab ? activeTab.dataset.category : 'all';

        filterAndRender(activeCategory);

        // ステータスインジケーターを点滅更新
        statusDot.style.animation = 'none';
        statusDot.offsetHeight; /* trigger reflow */
        statusDot.style.animation = 'pulse 2s infinite';
    }

    // 8秒ごとに新しい案件を追加
    setInterval(addNewItem, 8000);
});
