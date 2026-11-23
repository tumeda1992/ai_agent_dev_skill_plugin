"""指定された二つの入口を、それぞれの README から導いた期待値と照合する。"""

import sys
from collections import Counter
from itertools import product
from pathlib import Path
from runpy import run_path


spike = Path(__file__).resolve().parents[2]
select = run_path(str(spike / "supplier-selection/selection.py"))["select_supplier"]
publish = run_path(str(spike / "publication/publication.py"))["publish_suppliers"]


def offer(supplier, items, price=0, verified=True):
    return dict(id=supplier, items=set(items), price=price, verified=verified)


def selection_contract(offers, required):
    ranking = sorted(offers, key=lambda row: row["price"])
    for row in ranking:
        if row["verified"] and required.issubset(row["items"]):
            return row["id"]
    return None


def notices_for(offers):
    return [{key: row[key] for key in ("id", "items", "verified")} for row in offers]


def publication_contract(notices, required):
    published = []
    missing = set(required)
    for notice in notices:
        if notice["verified"]:
            published.append(notice["id"])
            missing.difference_update(notice["items"])
    return None if missing else published


def explicit_examples():
    required = {"机", "照明"}
    cases = [
        ("2社に分散", [offer("Z", ["机"], 10), offer("A", ["照明"], 20)],
         None, ["Z", "A"]),
        ("高いAだけが完備", [offer("Z", ["机"], 10), offer("A", required, 20)],
         "A", ["Z", "A"]),
        ("安いZだけが完備", [offer("Z", required, 10), offer("A", ["照明"], 20)],
         "Z", ["Z", "A"]),
        ("未確認だけが不足品を扱う",
         [offer("Z", ["机"], 10), offer("A", required, 0, False)], None, None),
        ("同額の完備2社と対象外品だけの確認済み1社",
         [offer("M", required, 20), offer("A", required, 20), offer("Z", ["幕"], 5)],
         "M", ["M", "A", "Z"]),
        ("未確認の最安完備社と確認済み完備2社",
         [offer("U", required, 0, False), offer("Z", required, 50), offer("A", required, 40)],
         "A", ["Z", "A"]),
        ("空の入力", [], None, None),
    ]
    for label, offers, expected_id, expected_ids in cases:
        notices = notices_for(offers)
        assert selection_contract(offers, required) == expected_id
        assert publication_contract(notices, required) == expected_ids
        print(f"{label} | 選定 実際={select(offers, required)!r} 期待={expected_id!r} "
              f"| 公開 実際={publish(notices, required)!r} 期待={expected_ids!r}")


def bounded_comparison():
    item_sets = [set(), {"机"}, {"照明"}, {"机", "照明"}]
    variants = list(product(item_sets, (0, 1), (False, True)))
    mismatches = Counter()
    total = 0
    for count in range(4):
        for group in product(variants, repeat=count):
            offers = [offer(supplier, *variant) for supplier, variant in zip("ZAM", group)]
            notices = notices_for(offers)
            for required in item_sets[1:]:
                total += 1
                expected = selection_contract(offers, required)
                if select(offers, required) != expected:
                    mismatches["選定・適格社なし" if expected is None else "選定・適格社あり"] += 1
                if publish(notices, required) != publication_contract(notices, required):
                    mismatches["公開"] += 1
    print(f"入力列と必要品の組合せ 各入口{total}件")
    for label in ("選定・適格社なし", "選定・適格社あり", "公開"):
        print(f"{label} 契約との差={mismatches[label]}件")


if __name__ == "__main__":
    print(sys.version.split()[0])
    explicit_examples()
    bounded_comparison()
