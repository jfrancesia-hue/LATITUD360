"""Capture sectional screenshots of the editorial landing for visual review."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"
OUT = ROOT / "screenshots"
OUT.mkdir(exist_ok=True)


def main() -> None:
    url = HTML.resolve().as_uri()
    print(f"Opening {url}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        page.goto(url, wait_until="networkidle", timeout=30_000)

        # Ceremonial intro takes ~3.4s. Wait longer to be safe.
        page.wait_for_timeout(5000)

        # Force IntersectionObserver Reveals to fire by triggering a slow scroll
        # to bottom and back to top. This mounts every section in the DOM.
        height = page.evaluate("document.body.scrollHeight")
        steps = 30
        for i in range(steps + 1):
            page.evaluate(f"window.scrollTo(0, {int(height * i / steps)})")
            page.wait_for_timeout(120)
        page.wait_for_timeout(800)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1500)

        # 1) Top of page — masthead + hero
        page.screenshot(path=str(OUT / "01-masthead-hero.png"), full_page=False)
        print("  [OK] 01-masthead-hero.png")

        # 2) Gran cronica
        cronica_y = page.evaluate(
            "document.getElementById('cronica')?.offsetTop ?? 0"
        )
        page.evaluate(f"window.scrollTo(0, {cronica_y})")
        page.wait_for_timeout(1000)
        page.screenshot(path=str(OUT / "02-gran-cronica.png"), full_page=False)
        print("  [OK] 02-gran-cronica.png")

        # 3) Atlas mapa
        atlas_y = page.evaluate(
            "document.getElementById('atlas')?.offsetTop ?? 0"
        )
        page.evaluate(f"window.scrollTo(0, {atlas_y})")
        page.wait_for_timeout(1000)
        page.screenshot(path=str(OUT / "03-atlas-mapa.png"), full_page=False)
        print("  [OK] 03-atlas-mapa.png")

        # 4) Observatorio de datos — find by heading text
        obs_y = page.evaluate("""
            (() => {
              const headings = Array.from(document.querySelectorAll('h2'));
              const m = headings.find(h => h.innerText.includes('Lo que la industria'));
              if (!m) return 0;
              const sec = m.closest('section');
              return sec ? sec.offsetTop : 0;
            })()
        """)
        page.evaluate(f"window.scrollTo(0, {obs_y})")
        page.wait_for_timeout(1000)
        page.screenshot(path=str(OUT / "04-observatorio-datos.png"), full_page=False)
        print("  [OK] 04-observatorio-datos.png")

        # 5) Voces humanas
        voces_y = page.evaluate(
            "document.getElementById('voces')?.offsetTop ?? 0"
        )
        page.evaluate(f"window.scrollTo(0, {voces_y})")
        page.wait_for_timeout(1000)
        page.screenshot(path=str(OUT / "05-voces-humanas.png"), full_page=False)
        print("  [OK] 05-voces-humanas.png")

        # 6) Newsletter
        nl_y = page.evaluate(
            "document.getElementById('newsletter')?.offsetTop ?? 0"
        )
        page.evaluate(f"window.scrollTo(0, {nl_y})")
        page.wait_for_timeout(1000)
        page.screenshot(path=str(OUT / "06-newsletter.png"), full_page=False)
        print("  [OK] 06-newsletter.png")

        # Bonus: full-page mosaic
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(800)
        page.screenshot(path=str(OUT / "00-full-page.png"), full_page=True)
        print("  [OK] 00-full-page.png (full mosaic)")

        browser.close()

    print(f"\nAll screenshots saved to: {OUT}")


if __name__ == "__main__":
    main()
