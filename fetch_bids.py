import requests
from bs4 import BeautifulSoup
import json
import re
import time
from datetime import datetime, timedelta

BASE_URL = "https://www.kkj.go.jp"
SEARCH_URL = "https://www.kkj.go.jp/s/"

def get_latest_bids():
    """Scrapes the latest bids and returns them as a list of dicts."""
    all_items = []
    print("Starting scraper job...")
    
    # Date limit
    limit_date = datetime.now() - timedelta(days=60)
    print(f"Filtering items older than: {limit_date.strftime('%Y-%m-%d')}")

    # Configuration for scraping
    CONFIG = [
        # 1. Digital (デジタル)
        {
            "id": "digital",
            "queries": [
                {"S": "デジタル"}, {"S": "システム"}, {"S": "DX"}, 
                {"S": "ソフトウェア"}, {"S": "パソコン"}, {"S": "ネットワーク"}
            ],
            "title_keywords": ["デジタル", "システム", "DX", "ソフトウェア", "パソコン", "ネットワーク", "サーバ", "機器", "アプリ", "Web"]
        },
        # 2. Tourism (観光)
        {
            "id": "tourism",
            "queries": [
                {"S": "観光"}, {"S": "旅行"}, {"S": "インバウンド"}, {"S": "宿泊"}
            ],
            "title_keywords": ["観光", "旅行", "インバウンド", "宿泊", "ツアー", "誘客"]
        },
        # 3. Education (教育)
        {
            "id": "education",
            "queries": [
                {"S": "教育"}, {"S": "学校"}, {"S": "研修"}, {"S": "教材"}
            ],
            "title_keywords": ["教育", "学校", "研修", "教材", "授業", "学習", "講師"]
        },
        # 4. Agriculture (農業)
        {
            "id": "agriculture",
            "queries": [
                {"S": "農業"}, {"S": "農地"}, {"S": "農協"}, {"S": "食品"}
            ],
            "title_keywords": ["農業", "農地", "農協", "食品", "農林", "野菜", "米", "食肉"]
        },
        # 5. Construction (工事)
        {
            "id": "construction",
            "queries": [
                {"S": "工事"}
            ],
            "title_keywords": ["工事", "建築", "改修", "建設", "土木", "修繕"]
        },
        # 6. Service (サービス)
        {
            "id": "service",
            "queries": [
                {"S": "業務委託"}, {"S": "清掃"}, {"S": "警備"}, {"S": "受付"}
            ],
            "title_keywords": ["業務委託", "清掃", "警備", "受付", "運営", "保守", "点検"]
        },
        # 7. Other (その他 - e.g. Goods/Purchase)
        {
            "id": "other",
            "queries": [
                {"S": "物品"}, {"S": "購入"}
            ],
            "title_keywords": ["物品", "購入", "備品", "車両", "印刷"]
        }
    ]

    for cat in CONFIG:
        print(f"Fetching category: {cat['id']}...")
        
        for q in cat['queries']:
            q_str = list(q.values())[0] 
            print(f"  -> Searching for '{q_str}'...")

            try:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }

                # Allow fetching more items to ensure we find matches after filtering
                resp = requests.get(SEARCH_URL, params=q, headers=headers, timeout=20)
                resp.encoding = resp.apparent_encoding
                
                soup = BeautifulSoup(resp.text, "html.parser")
                results = soup.find_all("div", class_="box_contents")
                
                count = 0
                for item in results:
                    # Limit per keyword scan. Total sum will be around ~20-30 per category ideally.
                    if count >= 20: 
                        break
                    
                    # Extract Agency FIRST
                    agency = "不明"
                    dd_agency = item.find("dd", style=re.compile("text-align: left;"))
                    if dd_agency:
                        spans = dd_agency.find_all("span")
                        if spans:
                            agency = spans[0].get_text(strip=True)

                    # Extract Title
                    dt = item.find("dt")
                    if not dt: continue
                    link_tag = dt.find("a")
                    if not link_tag: continue
                    title_text = link_tag.get_text(strip=True)
                    
                    # --- TITLE FILTERING ---
                    if cat["title_keywords"]:
                        hit = False
                        for kw in cat["title_keywords"]:
                            if kw in title_text:
                                hit = True
                                break
                        if not hit:
                            continue 
                    # -----------------------

                    href = link_tag.get("href")
                    if not href or "/d/?D=" not in href:
                        continue
                        
                    full_url = BASE_URL + href
                    if "&L=" not in full_url:
                        full_url += "&L=ja"

                    # Extract Date & Filter (60 days)
                    date_display = ""
                    date_iso = ""
                    p_date = item.find("p", class_="fRight")
                    is_within_range = False 
                    
                    if p_date:
                        txt = p_date.get_text()
                        match = re.search(r"(\d{4}-\d{2}-\d{2})", txt)
                        if match:
                            raw_date = match.group(1)
                            try:
                                dt_obj = datetime.strptime(raw_date, "%Y-%m-%d")
                                date_display = f"{dt_obj.year}年{dt_obj.month}月{dt_obj.day}日"
                                date_iso = raw_date
                                if dt_obj >= limit_date:
                                    is_within_range = True
                            except:
                                date_display = raw_date
                                date_iso = raw_date # Fallback
                    
                    if not is_within_range:
                        continue

                    # Add to list
                    all_items.append({
                        "title": title_text,
                        "category": cat["id"],
                        "agency": agency,
                        "date": date_display,
                        "date_iso": date_iso, # For sorting
                        "url": full_url
                    })
                    count += 1
                
            except Exception as e:
                print(f"     -> Error: {e}")

    # Remove duplicates
    unique_map = {}
    for item in all_items:
        unique_map[item['title']] = item
    
    unique_items = list(unique_map.values())
    
    # Sort in Python just in case
    try:
        unique_items.sort(key=lambda x: x['date_iso'], reverse=True)
    except:
        pass # Ignore sort errors

    # Limit total items to 100? Or just return all? User asked to "Get 100 items".
    # I'll return up to 150 to be safe, but let's just return all unique valid ones.
    print(f"Total unique items found: {len(unique_items)}")

    return unique_items

if __name__ == "__main__":
    # If run as a script, generate the data.js file AND print JSON to stdout
    items = get_latest_bids()
    
    js_content = f"""// This file is auto-generated by fetch_bids.py
// Do not edit manually. Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

window.GENERATED_BID_DATA = {json.dumps(items, ensure_ascii=False, indent=4)};
"""

    with open("data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
        
    # Also save as JSON for server to read easily if needed
    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=4)

    print(f"Done. Saved {len(items)} unique items to data.js.")
