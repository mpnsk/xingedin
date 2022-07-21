import express from 'express';
import {chromium, ElementHandle} from "playwright";
import cors from 'cors';

const headless = false;

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
// for (let i = 0; i < postings.length; i++) {
    for (let i = 0; i < Math.min(postings.length, 5); i++) {
        const href = await postings[i]?.getAttribute('href');
        const jobPage = await browser.newPage();
        const url = 'https://de.indeed.com' + href;
        await jobPage.goto(url)

        await jobPage.pause()
        const title = await (await jobPage.$('h1.icl-u-xs-mb--xs'))?.textContent();
        if (title == undefined) console.error('could not find job title', url)
        const company = await jobPage.locator('div.jobsearch-CompanyInfoContainer>div>div>div>div>div:nth-child(2)>div>a')
            .textContent()
        if (company == undefined) console.error('could not find job company', url)
        const location = await jobPage.locator('div.jobsearch-CompanyInfoContainer>div>div>div>div:nth-child(2)>div')
            .textContent()
        if (location == undefined) console.error('could not find job location', url)

        const job = {title, location, company, url}
        console.log('job #' + i, job)
        res.write(JSON.stringify(job));
        await jobPage.close()
        res.write('#####')
    }
    await browser.close()
    res.end()
})


const port = process.env.port || 8080;
const server = app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/');
});
server.on('error', console.error);
