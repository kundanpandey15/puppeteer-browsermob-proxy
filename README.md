# puppeteer-browsermob-proxy
Code to use browsermob-proxy in puppeteer browser instances or in nodeJS applications

This will help you to manipulate HTTP requests and responses, capture HTTP content, and export performance data as a HAR file using puppeteer in a nodejs application.
Before trying this solution first you need basic knowledge of browsermob-proxy and puppeteer.

Getting started: For full code please refer to the file  -

###### Step-1 - Install puppeteer or puppeteer-core and browsermob-proxy in your nodeJS based application -

```
>> npm install puppeteer-core_
>> npm install browsermob-proxy_
```

###### Step-2 - Run browsermob-proxy in background and fetch host and port number
1. Get release version of browsermob-proxy from location - https://github.com/lightbody/browsermob-proxy/releases/download/browsermob-proxy-2.1.4/browsermob-proxy-2.1.4-bin.zip
2. Run the batch file from above downloaded files - \bin\browsermob-proxy.bat
3. Note down the host and port. By default it is localhost and 8080.

###### Step-2 - Create proxy proxy from your nodejs and puppeteer application
1- Add all the required stuffs
```
    var puppeteer = require('puppeteer-core'),
        Proxy = require('browsermob-proxy').Proxy,
        proxyHost = 'localhost',
        delay = require('delay');
```
2- Start the browsermob-proxy
```
var proxy = new Proxy({
    host: proxyHost
});
proxy.start(function (err, data) {
    if (!err) {
        //Do the code to perform and interact with puppeteer browser and get the har files
    } else {
        console.error('Error starting proxy: ' + err);
    }
});
```

###### Step-3 - Performing browser activities from puppeteer and getting all the har files
1- Starting proxy and getting HAR
```
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
```
2- Performing browser activities using puppeteer
```
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
```

