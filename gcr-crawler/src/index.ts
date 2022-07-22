import express, {Express} from 'express';
import {Browser, BrowserContext, chromium, Cookie, ElementHandle, Locator} from "playwright";
import cors from 'cors';
import {devtools, headless} from './settings';
import indeed from "./crawler/indeed.js";
import xing from "./crawler/xing.js";


const app = express();

// xing.get('/xing', app)
app.get('/xing', async (req, res)=>{
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    xing.get(req,res)
})
app.get('/indeed', async (req, res)=>{
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    indeed.get(req, res)
})
app.get('/', async (req, res) => {
    const link = (s: string): string => `<a href='/${s}'>${s}</a>`
    const s =
        link('indeed') +
        "<br> " +
        link('xing')
    res.send(s);
});

app.use(cors({
    origin: '*'
}));

const port = process.env.port || 8080;
const server = app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/');
});
server.on('error', console.error);
