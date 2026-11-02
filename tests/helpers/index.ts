import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

// Disables CSS transitions on the page. Call this before a change such as setTheme, not after:
// canceling a transition that has already started does not reliably jump to the final value on
// every engine, so a check right after the change (axe's contrast check, for example) could
// still sample an in-between frame. Also waits two real paints in a separate round trip, so the
// override is confirmed active before the caller makes its change in a later call: under load,
// inserting the style and changing the page in the same task can still let a transition start,
// because the engine has not necessarily applied the new stylesheet yet.
export async function disableTransitions(page: Page) {
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; }',
  });
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

// Fails when axe finds serious or critical WCAG 2.1 A/AA violations on the current page.
// Moderate and minor violations are allowed on purpose, so they do not fail the tests.
export async function expectNoA11yViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blocking = violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(
    blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s)`),
  ).toEqual([]);
}

// Fails when the page scrolls sideways, which means some content overflows the viewport.
export async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, bodyScrollWidth, clientWidth } = await page.evaluate(
    () => ({
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }),
  );
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  // A wrapper with overflow-x: hidden would clip content without widening <html>.
  expect(bodyScrollWidth).toBeLessThanOrEqual(clientWidth);
}

// Switches the theme by toggling the `dark` class on <html>, the same hook the CSS tokens use.
export async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((t) => {
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, theme);
}
