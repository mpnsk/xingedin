import {chromium} from "playwright";
import {devtools, headless, maxJobs} from "../settings.js";

async function get(req: any, res: any) {
    const browser = await chromium.launch({headless, devtools});
    const page = await browser.newPage();
    await page.goto('https://de.indeed.com/jobs' +
        '?q=' + req.query.q +
        '&l=' + req.query.l +
        '&radius=' + req.query.r);
    const postings = await page.$$('a.jcs-JobTitle');

    async function extract(href: Promise<string | null> | undefined) {
        const jobPage = await browser.newPage();
        const url = 'https://de.indeed.com' + await href;
        await jobPage.goto(url)

        const title = await (await jobPage.$('h1.icl-u-xs-mb--xs'))?.textContent();
        if (title == undefined) console.error('could not find job title', url)
        const company = await jobPage.locator('div.jobsearch-CompanyInfoContainer>div>div>div>div>div:nth-child(2)>div>a')
            .textContent()
        if (company == undefined) console.error('could not find job company', url)
        const location = await jobPage.locator('div.jobsearch-CompanyInfoContainer>div>div>div>div:nth-child(2)>div')
            .textContent()
        if (location == undefined) console.error('could not find job location', url)

        const job = {title, location, company, url}
        res.write(JSON.stringify(job));
        console.log(job)
        await jobPage.close()
        res.write('#####')
    }

    const hrefs = []
    for (let i = 0; i < Math.min(postings.length, maxJobs); i++) {
        const href: Promise<string | null> | undefined = postings[i]?.getAttribute('href');
        hrefs.push(href)
    }
    await Promise.all(hrefs.map(value => extract(value)))
    await browser.close()
}

export default {get}