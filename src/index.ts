import { random } from 'lodash';
import { id, password } from './userinfo';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chromium = require('chrome-aws-lambda');

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const sleepRandomly = async (min?: number, max?: number): Promise<void> => {
  const ms = random(min || 500, max || 500, false);
  await sleep(ms);
};

const crawl = async (): Promise<void> => {
  const startedAt = Date.now();
  console.log(`startedAt: ${startedAt}`);

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  // const mainPage = 'https://m.cafe.daum.net/parkboyoungfd/';

  const logIn = async (): Promise<void> => {
    // await page.goto(mainPage);
    // await sleepRandomly(3000, 4000);

    // await page.click("#daumMinidaum");
    // await sleepRandomly(3000, 4000);

    // await page.click(".txt_kakao");
    // await sleepRandomly(3000, 4000);

    const logInPage =
      'https://accounts.kakao.com/login?continue=https%3A%2F%2Flogins.daum.net%2Faccounts%2Fksso.do%3Frescue%3Dtrue%26url%3Dhttps%253A%252F%252Fm.cafe.daum.net%252Fparkboyoungfd%252F_rec';

    await page.goto(logInPage);
    await sleepRandomly(2000, 3000);

    await page.focus('#id_email_2');
    await sleepRandomly();

    await page.keyboard.type(id);
    await sleepRandomly();

    await page.focus('#id_password_3');
    await sleepRandomly();

    await page.keyboard.type(password);
    await sleepRandomly();

    await page.click(
      '#login-form > fieldset > div.wrap_btn > button.btn_g.btn_confirm.submit'
    );
    await sleepRandomly(2000, 3000);
  };

  const getHits = (): number => {
    // https://m.cafe.daum.net/supporters/Mhj5/21 [안내] 카페 응원하기 정책 및 위젯 개편
    const date = new Date();
    const currentHour = date.getHours(); // GMT+9
    const hearts = currentHour >= 22 || currentHour <= 0 ? 40 : 20;
    const hits = random(hearts * 2, hearts * 2 + 20, false);
    return hits;
  };

  const clickHearts = async (): Promise<void> => {
    // await page.goto(mainPage);
    // await sleepRandomly();
    const clickHeart = async (hits: number): Promise<void> => {
      if (!hits) return;
      const [button] = await page.$x(
        `//*[@id="daumHead"]/div/div[2]/div/div/div[3]/div/button`
      );
      if (button) {
        await button.click();
      }
      await sleepRandomly(100, 150);
      await clickHeart(hits - 1);
    };

    const hits = getHits();
    await clickHeart(hits);
    await sleepRandomly();
  };

  await logIn();
  await clickHearts();
  await browser.close();
  const endedAt = Date.now();
  console.log(`endedAt: ${endedAt}, Duration: ${endedAt - startedAt} ms`);
};

export default crawl;
