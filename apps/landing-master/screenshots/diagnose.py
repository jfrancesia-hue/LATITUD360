"""Diagnose why the React app isn't mounting."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"


def main() -> None:
    url = HTML.resolve().as_uri()
    print(f"Opening {url}")

    logs = []
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda exc: errors.append(f"[pageerror] {exc}"))

        page.goto(url, wait_until="networkidle", timeout=30_000)
        page.wait_for_timeout(6000)

        root_html = page.evaluate("document.getElementById('root')?.innerHTML ?? '<missing>'")
        print(f"\n--- #root content (first 400 chars) ---")
        print((root_html[:400] + "...") if len(root_html) > 400 else root_html)
        print(f"\n--- root child count ---")
        count = page.evaluate("document.getElementById('root')?.children.length ?? 0")
        print(f"children: {count}")

        print(f"\n--- console logs ({len(logs)}) ---")
        for l in logs[:30]:
            print(l)

        print(f"\n--- page errors ({len(errors)}) ---")
        for e in errors[:30]:
            print(e)

        browser.close()


if __name__ == "__main__":
    main()
