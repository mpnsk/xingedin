import {chromium, Locator} from "playwright";
import {devtools, headless, maxJobs} from "../settings.js";

/*
    types should be (Express.Request, Express.Response)
    but for some reason express doesn't have the res.write, res.send and such methods on the type
 */
async function get(req: any, res: any) {
    const browser = await chromium.launch({headless, devtools});
    const page = await browser.newPage();
    await page.goto('https://www.xing.com/jobs/search?utf8=%E2%9C%93&nrs=1' +
        '&keywords=' + req.query.q +
        '&location=' + req.query.l +
        '&radius=' + req.query.r);
    const locator: Locator = page.locator('button#consent-accept-button');
    await locator.click()
    const postings = await page.locator('section ul article a');

    async function extract(href: string | null) {
        const jobPage = await browser.newPage()
        const url = 'https://xing.com' + href;
        console.log(url)
        await jobPage.goto(url)

        const title = await jobPage.title()

        const company = await jobPage.locator('main h2').first().textContent()
        if (company === null) console.error('could not find job company', url)

        const location = await jobPage.locator('main ul>li>span').first().textContent()
        if (location === null) console.error('could not find job location', url)

        const publishDate = await jobPage.locator('[class*=info-info-time-]').first().textContent()
        if (publishDate === null) console.error('could not find publish date', url)

        const job = {title, company, location, publishDate, url}

        res.write(JSON.stringify(job));
        console.log(job)
        await jobPage.close()
        res.write('#####')
    }

    const hrefs = []
    const count = await postings.count();
    console.log('count', count);
    for (let i = 0; i < Math.min(count, maxJobs * 2); i++) {

        const href = await postings.nth(i)?.getAttribute('href');
        const com = 'https://login.xing.com';
        console.log('href ', href);

        if (href === com) {
            continue
        }
        hrefs.push(href)
    }
    console.log('hrefs', hrefs)
    await Promise.all(hrefs.map(value => {
        return extract(value);
    }))
    await browser.close()
}


export default {get}