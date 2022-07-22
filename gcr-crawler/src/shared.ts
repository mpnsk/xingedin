import {Browser, BrowserContext, Cookie, ElementHandle} from "playwright";

type HTML = ElementHandle<SVGElement | HTMLElement>
type HTMLNull = HTML | null
async function getCookies(browser: Browser) {
    for (let i = 0; i < browser.contexts().length; i++) {
        const browserContext: BrowserContext = browser.contexts()[i];
        const cookies: Array<Cookie> = await browserContext.cookies();
        if (cookies.length == 0) console.log('no cookies')
        else console.log('cookies', cookies);
    }
}
