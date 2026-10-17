#!/usr/bin/env python3
"""Collect RSS/Atom headlines for jacOS Newton's /var/spool/news.

Run from jacOS repository root: python3 scripts/fetch_news.py
Output: public/news.json (generated at build time, no credentials needed).
"""

import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

FEEDS = [
    ("GamingOnLinux", "https://www.gamingonlinux.com/article_rss.php"),
    ("Mozilla Hacks", "https://hacks.mozilla.org/feed/"),
    ("GitHub Blog", "https://github.blog/feed/"),
]
OUTPUT = Path("public/news.json")
ATOM = "{http://www.w3.org/2005/Atom}"


class StripHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.text = []

    def handle_data(self, data):
        self.text.append(data)


def plain_text(raw):
    parser = StripHTML()
    parser.feed(raw or "")
    return re.sub(r"\s+", " ", " ".join(parser.text)).strip()[:240]


def iso_date(raw):
    if not raw:
        return None
    try:
        dt = parsedate_to_datetime(raw)
    except (TypeError, ValueError):
        try:
            dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def entries(root):
    for item in root.findall("./channel/item"):
        yield {
            "title": item.findtext("title"),
            "url": item.findtext("link"),
            "summary": item.findtext("description"),
            "date": item.findtext("pubDate"),
        }

    for item in root.findall(f"{ATOM}entry"):
        link = next((e.get("href") for e in item.findall(f"{ATOM}link")
                     if e.get("rel", "alternate") == "alternate"), None)
        yield {
            "title": item.findtext(f"{ATOM}title"),
            "url": link,
            "summary": item.findtext(f"{ATOM}summary") or item.findtext(f"{ATOM}content"),
            "date": item.findtext(f"{ATOM}published") or item.findtext(f"{ATOM}updated"),
        }


def collect():
    all_items = []
    working_feeds = 0
    for source, url in FEEDS:
        try:
            request = Request(url, headers={"User-Agent": "jacOS-Pager/1.0 RSS reader"})
            with urlopen(request, timeout=20) as response:
                root = ET.fromstring(response.read())
            count = 0
            for entry in entries(root):
                link = (entry["url"] or "").strip()
                title = plain_text(entry["title"])
                if not link.startswith(("https://", "http://")) or not title:
                    continue
                all_items.append({
                    "id": hashlib.sha256(link.encode()).hexdigest()[:16],
                    "source": source,
                    "title": title,
                    "summary": plain_text(entry["summary"]),
                    "url": link,
                    "publishedAt": iso_date(entry["date"]),
                })
                count += 1
                if count >= 12:
                    break
            print(f"{source}: {count} articles")
            working_feeds += 1
        except Exception as exc:
            print(f"WARNING: {source}: {exc}", file=sys.stderr)

    if working_feeds == 0 or not all_items:
        raise SystemExit("No articles retrieved. Keeping existing news file unchanged.")

    unique = {item["id"]: item for item in all_items}
    items = sorted(unique.values(), key=lambda item: item["publishedAt"] or "", reverse=True)[:30]
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({
        "updatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "items": items,
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(items)} articles to {OUTPUT}")


if __name__ == "__main__":
    collect()
