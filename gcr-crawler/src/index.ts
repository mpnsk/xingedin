import express from 'express';
import {chromium, ElementHandle} from "playwright";
import cors from 'cors';
import {Job} from 'shared-types/MyType'

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
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://de.indeed.com/jobs?q=Softwareentwickler');
    const postings = await page.$$('a.jcs-JobTitle');
    const jobs: Job[] = []
// for (let i = 0; i < postings.length; i++) {
    for (let i = 0; i < Math.min(postings.length, 3); i++) {
        const attribute = await postings[i]?.getAttribute('href');
        const newPage = await browser.newPage();
        await newPage.goto('https://de.indeed.com' + attribute)

        const elementHandle: HTMLNull = await newPage.$('h1.icl-u-xs-mb--xs');
        const s: string | undefined = await elementHandle?.innerText();
        if (s == undefined) {
            console.log('error!')
            console.error("could not find job title")
            console.error(elementHandle)
            console.error(s)
        } else {
            const job = {title: s}
            console.log('job #' + i, job)
            jobs.push(job)
            // res.write('#'+i);
            res.write(JSON.stringify(job));
        }
        await newPage.close()
        res.write('#####')
    }
    console.log('end')
    await browser.close()
    console.log(jobs)
    res.end()
    // return jobs
})


const port = process.env.port || 8080;
const server = app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/');
});
server.on('error', console.error);
