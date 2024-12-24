const puppeteer = require('puppeteer');

async function visit(obj) {
    let browser;
    let url = obj['url'];
    let cookie = obj['cookie'];
    try {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
            args: [
                '--no-sandbox',
                '--headless',
                '--disable-gpu',
                '--disable-dev-shm-usage',
            ],
        });
        let page = await browser.newPage();

        await page.setExtraHTTPHeaders({
            'Cookie': `access_token=${cookie}`
        });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await new Promise(r => setTimeout(r, 10000));
    } catch (e) {
        console.log(e);
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (e) {
                console.error("Error closing browser:", e);
            }
        }
        process.exit(0);
    }
}

if (process.argv.length > 2) {
    visit(JSON.parse(process.argv[2]));
} else {
    console.error("No arguments provided.");
    process.exit(1);
}