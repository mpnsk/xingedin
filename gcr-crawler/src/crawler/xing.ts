import {chromium, Locator} from "playwright";
import {devtools, headless, maxJobs} from "../settings.js";
import {Express} from "express";

function get(path: string, app: Express): Express {
    return app.get(path, async (req, res) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Transfer-Encoding', 'chunked');
            const browser = await chromium.launch({headless, devtools});
            const page = await browser.newPage();
            await page.goto('https://www.xing.com/jobs/search?utf8=%E2%9C%93&nrs=1&keywords=werkstudent%2Bjava&location=leipzig&radius=70');
            const locator: Locator = page.locator('button#consent-accept-button');
            await locator.click()
            const postings = await page.locator('section ul article a');
            console.log('postings', postings)

            async function extract(href: string | null) {
                console.log('extract')
                const jobPage = await browser.newPage();
                const url = 'https://xing.com' + href;
                console.log(url)
                await jobPage.goto(url)
                const title = await jobPage.title();
                const company = await jobPage.locator('main h2').first().textContent();
                if (company == null) console.error('could not find job company', url)
                const job = {title, url, company}
                res.write(JSON.stringify(job));


                // const title = await (await jobPage.$('h1.icl-u-xs-mb--xs'))?.textContent();
                // if (title == undefined) console.error('could not find job title', url)
                // const company = await jobPage.locator('div.jobsearch-CompanyInfoContainer>div>div>div>div>div:nth-child(2)>div>a')
                //     .textContent()
                // if (company == undefined) console.error('could not find job company', url)
                // const location = await jobPage.locator('div.jobsearch-CompanyInfoContainer>div>div>div>div:nth-child(2)>div')
                //     .textContent()
                // if (location == undefined) console.error('could not find job location', url)
                //
                // const job = {title, location, company, url}
                // res.write(JSON.stringify(job));
                // console.log(job)
                // await jobPage.close()
                // res.write('#####')
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
            res.end()
        }
    )

}

export default {get}