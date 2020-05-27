import { Browser, Page, launch } from 'puppeteer';
import { start, EasyServer } from '../server/noticias';

describe("basic complete tests", function(){
    this.timeout(20000);
    var browser: Browser;
    var page: Page;
    var server:EasyServer;
    before(async ()=>{
        server = new EasyServer();
        await server.startListening();
        browser = await launch({headless: false});
    })
    beforeEach(async ()=>{
        page = await browser.newPage();
    })
    afterEach(async()=>{
        await page.close();
    })
    after(async()=>{
        await server.stopListening();
        await browser.close();
    })
    it("navigate to the list", async function(){
        await page.goto('http://localhost:3303/menu');
        await page.click('#listLink');
        await page.waitForSelector('#filesTitle');
        await page.waitForSelector('#file3');
    })
    it("navigate to the list then return to menu", async function(){
        await page.goto('http://localhost:3303/menu');
        await page.click('#listLink');
        await page.waitForSelector('#filesTitle');
        await page.goBack();
        await page.waitForSelector('#listLink');
    })
});

describe("exit tests", function(){
    this.timeout(5000);
    // this.timeout(135000); // some linux take 2 minutes to close
    var browser: Browser;
    var page: Page;
    beforeEach(async ()=>{
        browser = await launch({headless: false});
        page = await browser.newPage();
    })
    it("open and close fast", async function(){
        var server = new EasyServer();
        await server.startListening();
        var finalizo = start({skipOpen:true, listeningServer:server});
        // TODO: acá hay un entryPoint
        await page.goto('http://localhost:3303/menu');
        // await page.waitForNavigation();
        await page.click('#closeButton');
        await finalizo;
        browser.close();
        return true;
    })
});
