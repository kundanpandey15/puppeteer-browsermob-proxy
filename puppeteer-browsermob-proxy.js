var puppeteer = require('puppeteer-core'),
    Proxy = require('browsermob-proxy').Proxy,
    proxyHost = 'localhost',
    delay = require('delay');

var proxy = new Proxy({
    host: proxyHost
});
proxy.start(function (err, data) {
    if (!err) {
        proxy.startHAR(data.port, function (err, resp) {
            if (!err) {
                // DO WHATEVER WEB INTERACTION YOU WANT USING THE PROXY
                doPuppeteerStuff(proxyHost + ':' + data.port, data.port, function () {
                    proxy.getHAR(data.port, function (err, resp) {
                        if (!err) {
                            console.log(resp);
                        } else {
                            console.err('Error getting HAR file: ' + err);
                        }
                        proxy.stop(data.port, function () {});
                    });
                });
            } else {
                console.error('Error starting HAR: ' + err);
            }
        });
    } else {
        console.error('Error starting proxy: ' + err);
    }
});

async function doPuppeteerStuff(proxy1, port, cb) {
    await puppeteer.launch({
            headless: false,
            executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
            defaultViewport: {
                width: 1346,
                height: 680
            },
            proxy: proxy1,
            ignoreHTTPSErrors: true,
            args: [
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--window-size=1346,758',
                '--disk-cache-size=0',
                '--proxy-server=' + proxy1
            ] 
        }).then(async (browser) => {
            let page = (await browser.pages())[0];
            await delay(2000);
            await page.goto('http://www.kundanpandey.in/');
            //Do whatever you want here
            await delay(20000);
        })
        .catch((error) => {
            console.log(error);
        })
}
