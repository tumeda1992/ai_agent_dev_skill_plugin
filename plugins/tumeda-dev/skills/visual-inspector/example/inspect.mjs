import {
  BASE_URL,
  createLoggedInPage,
} from '../../../lib/browser-session.mjs';

const artifactDir =
  'tools/visual-inspection/tmp/20260720-edit-profile/phase-2';

const { browser, page } = await createLoggedInPage({
  email: process.env.VISUAL_TEST_EMAIL,
  password: process.env.VISUAL_TEST_PASSWORD,
});

await page.goto(`${BASE_URL}/settings`);
await page.waitForLoadState('networkidle');
await page.screenshot({ path: `${artifactDir}/01-initial.png` });

await page.getByLabel('Display name').fill('Updated name');
await page.getByRole('button', { name: 'Save' }).click();
await page.getByText('Saved').waitFor();
await page.screenshot({ path: `${artifactDir}/02-saved.png` });

await page.reload();
await page.getByDisplayValue('Updated name').waitFor();
await page.screenshot({ path: `${artifactDir}/03-reloaded.png` });

await browser.close();
