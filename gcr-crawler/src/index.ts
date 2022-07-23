import express from 'express';
import cors from 'cors';
import indeed from "./crawler/indeed.js";
import xing from "./crawler/xing.js";


const app = express();

app.use(cors({
    origin: '*'
}));

app.get('/xing', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    xing.get(req, res)
    res.end()
})
app.get('/indeed', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    indeed.get(req, res)
    res.end()
})
/** combines /xing and /indeed **/
app.get('/jobs', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    await Promise.allSettled(
        [
            indeed.get(req, res),
            xing.get(req, res)
        ]
    )
    res.end()
})
app.get('/', async (req, res) => {
    const link = (s: string): string => `<a href='/${s}'>${s}</a>`
    const s =
        link('indeed') +
        "<br> " +
        link('xing')
    res.send(s);
});

const port = process.env.port || 8080;
const server = app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/');
});
server.on('error', console.error);
