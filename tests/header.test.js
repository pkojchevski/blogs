const Page = require('./helpers/page');

// test('adds 2 numbers', () => {
//   const sum = 1 + 2;

//   expect(sum).toEqual(3);
// });

// test('We can launch a browser', async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//   });
//   const page = await browser.newPage();
// }, 15000);

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
}, 20000);

afterEach(async () => {
  await page.close();
});

test('The header has the correct text', async () => {
  const text = await page.getContentsOf('a.brand-logo');
  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
  await page.login();

  page.waitFor('a[href="/auth/logout"]');

  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual('Logout');
});
