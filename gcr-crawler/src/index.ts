import express from 'express';
import {chromium, ElementHandle} from "playwright";
import cors from 'cors';

const headless = true;
const maxJobs = 2;

const app = express();
app.get('/', async (req, res) => {
    // const promise = indeed();
    // const jobs = await promise;
    res.send("<a href='/jobs'>jobs</a>");
});
type HTML = ElementHandle<SVGElement | HTMLElement>
type HTMLNull = HTML | null
app.use(cors({
    origin: '*'
}));
app.get('/jobs', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    const browser = await chromium.launch({headless, devtools: true});
    const page = await browser.newPage();
    await page.goto('https://de.indeed.com/jobs?q=Softwareentwickler');
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

    const hrefs =[]
    for (let i = 0; i < Math.min(postings.length, maxJobs); i++) {
        const href: Promise<string | null> | undefined = postings[i]?.getAttribute('href');
        hrefs.push(href)
    }
    await Promise.all(hrefs.map(value => extract(value)))
    await browser.close()
    res.end()
})


const port = process.env.port || 8080;
const server = app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/');
});
server.on('error', console.error);
