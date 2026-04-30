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

        page.wait_for_timeout(5000)

        # Force IntersectionObserver Reveals to fire by triggering a slow scroll.
        height = page.evaluate("document.body.scrollHeight")
        steps = 30
        for i in range(steps + 1):
            page.evaluate(f"window.scrollTo(0, {int(height * i / steps)})")
            page.wait_for_timeout(120)
        page.wait_for_timeout(800)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1500)

        def shoot(name: str, scroll_js: str = "window.scrollTo(0, 0)") -> None:
            page.evaluate(scroll_js)
            page.wait_for_timeout(1000)
            page.screenshot(path=str(OUT / f"{name}.png"), full_page=False)
            print(f"  [OK] {name}.png")

        # 1) Top — masthead + hero with cordillera
        shoot("01-masthead-hero")

        # 2) Primera plana
        shoot(
            "02-primera-plana",
            "document.getElementById('primera-plana').scrollIntoView({block: 'start'})",
        )

        # 3) Sección cinematográfica "La montaña que piensa en agua"
        shoot(
            "03-montana-agua",
            """
            (() => {
              const h = Array.from(document.querySelectorAll('h2'))
                .find(h => h.innerText.includes('montaña que piensa'));
              if (h) h.closest('section').scrollIntoView({block: 'start'});
            })()
            """,
        )

        # 4) Gran crónica
        shoot(
            "04-gran-cronica",
            "document.getElementById('cronica').scrollIntoView({block: 'start'})",
        )

        # 5) Atlas con brújula
        shoot(
            "05-atlas-brujula",
            "document.getElementById('atlas').scrollIntoView({block: 'start'})",
        )

        # 6) Voces humanas
        shoot(
            "06-voces-humanas",
            "document.getElementById('voces').scrollIntoView({block: 'start'})",
        )

        # 7) Audiovisual + Observatorio
        shoot(
            "07-audiovisual-observatorio",
            "document.getElementById('audiovisual').scrollIntoView({block: 'start'})",
        )

        # 8) Archivo memoria
        shoot(
            "08-archivo",
            "document.getElementById('archivo').scrollIntoView({block: 'start'})",
        )

        # 9) Newsletter + footer
        shoot(
            "09-newsletter-footer",
            "document.getElementById('newsletter').scrollIntoView({block: 'start'})",
        )

        # Bonus: full-page mosaic
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(800)
        page.screenshot(path=str(OUT / "00-full-page.png"), full_page=True)
        print("  [OK] 00-full-page.png (full mosaic)")

        browser.close()

    print(f"\nAll screenshots saved to: {OUT}")


if __name__ == "__main__":
    main()
