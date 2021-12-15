import { test, expect, Page } from '@playwright/test';

type Person = Record<'accessKey' | 'passportNumber' | 'email', string>;
const PERSONS:Record<string, Person> = {
  LastnameF: {
    accessKey: '123',
    passportNumber: '456',
    email: 'email@email.com'
  }
};

async function fillPerson(page: Page, person: Person) {
  for(let n in person) await page.fill(`#${n}`, person[n]);
}

for(let name in PERSONS) {
  test.describe.parallel('check', () => {
    test(`check ${name}`, async ({ page }) => {
      await page.goto('https://tp.consular.go.th/en/check-status');
      await fillPerson(page, PERSONS[name]);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ url: '**/status' });
      await page.locator('img[alt="DGA"]').waitFor();
      expect(await page.screenshot()).toMatchSnapshot(`${name}.png`);
    });
  });
}