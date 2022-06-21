const puppeteer = require("puppeteer");

//http://127.0.0.1:9222/json/version
//--remote-debugging-port=9222 --disable-background-timer-throttling,--disable-backgrounding-occluded-windows,--disable-renderer-backgrounding

(async () => {

  const link = 'ws://127.0.0.1:9222/devtools/browser/ac177396-227b-47d3-81e4-d5a82a7abbed';
  const browser = await puppeteer.connect({
    headless: true,
    defaultViewport: null,
    browserWSEndpoint: link,
  });

  const page = await browser.newPage();
  
  await page.goto("https://cryptoroyale.one/skins/?m=marketplace", {
    waitUntil: "networkidle2",
  })

  let firstSkin = "wazza";
  startOver(); 
  
  async function startOver(){

    await page.reload({
      waitUntil: "networkidle2",
    });

    /*let gitMetrics = await page.metrics();
    console.log(gitMetrics.Timestamp);
    console.log(gitMetrics.TaskDuration);*/ 
    
    await page.waitForSelector("#markettable > thead > tr > th:nth-child(4)");
    await page.click("#markettable > thead > tr > th:nth-child(4)");
    await page.waitForSelector("#markettable > thead > tr > th:nth-child(4)");
    await page.click("#markettable > thead > tr > th:nth-child(4)");

    await page.waitForXPath('//*[@id="markettable"]/tbody/tr[1]/td[1]/span');
    let [getFirstXPath] = await page.$x('//*[@id="markettable"]/tbody/tr[1]/td[1]/span');
    let firstName = await page.evaluate(getFirstXPath => getFirstXPath.textContent, getFirstXPath);
    //console.log(firstSkin+" vs "+firstName);//

    if (firstSkin !== firstName){

      firstSkin = firstName;
      //console.log("\n" + "First five are:");//

      for (var i = 1; i < 6; i++){ 

        await page.waitForXPath('//*[@id="markettable"]/tbody/tr['+i+']/td[1]/span/text()');
        let [getNameXPath] = await page.$x('//*[@id="markettable"]/tbody/tr['+i+']/td[1]/span/text()');
        let name = await page.evaluate(getNameXPath => getNameXPath.textContent, getNameXPath);

        await page.waitForXPath('//*[@id="markettable"]/tbody/tr['+i+']/td[7]/text()');
        let [getPriceXPath] = await page.$x('//*[@id="markettable"]/tbody/tr['+i+']/td[7]/text()');
        let price = await page.evaluate(getPriceXPath => getPriceXPath.textContent, getPriceXPath);

        await page.waitForXPath('//*[@id="markettable"]/tbody/tr['+i+']/td[2]');
        let [getRarityXPath] = await page.$x('//*[@id="markettable"]/tbody/tr['+i+']/td[2]');
        let rarity = await page.evaluate(getRarityXPath => getRarityXPath.textContent, getRarityXPath);

        price = parseFloat(price.replace(/,/g, ''));
        name = name.replace(/\s/g, '');
        //name = name.toLowerCase();
        rarity = rarity.replace(/\s/g, '');

        //console.log(name+" "+price+" "+rarity);//

        if 
        (((name === "cobra") && (price <= 50000)) ||
        ((name === "spy") && (price <= 50000)) ||
        ((name === "fox777") && (price <= 50000)) ||
        ((name === "moneybag") && (price <= 35000)) ||
        ((name === "crlogo") && (price <= 35000)) ||
        ((name === "waffle2") && (price <= 25000)) ||
        ((rarity === "EPIC") && (price <= 3000)) ||
        ((rarity === "RARE") && (price <= 750)) ||
        ((rarity === "UNCOMMON") && (price <= 200)) ||
        ((name === "potion") && (price <= 7350)) ||
        ((name === "angel") && (price <= 7350)) ||
        ((name === "ghost") && (price <= 6500)) || 
        ((name === "monkey") && (price <= 6500)) || 
        ((name === "owl") && (price <= 6500)) ||
        ((name === "royman") && (price <= 6500)) ||
        ((name === "citrus") && (price <= 6500)) ||
        ((name === "shades") && (price <= 6500)) ||
        ((name === "discoball") && (price <= 6500)) ||
        ((name === "snowman") && (price <= 6000)) ||
        ((name === "jackolantern") && (price <= 2000)) ||
        ((name === "egg") && (price <= 2000)) ||
        ((name === "peach") && (price <= 1800)) ||
        ((name === "wheeee") && (price <= 1800)) ||
        ((name === "cat") && (price <= 420)) ||
        ((name === "moon") && (price <= 375)) ||
        ((name === "casinochip") && (price <= 375)) ||
        ((name === "panda") && (price <= 375)) ||
        ((name === "ufo") && (price <= 350)) ||
        ((name === "crosshair") && (price <= 105)) ||
        ((name === "vase") && (price <= 105)) ||
        (price <= 75)) 
        
        {

          await page.waitForSelector("#markettable > tbody > tr:nth-child("+i+") > td:nth-child(2) > a");
          await page.click("#markettable > tbody > tr:nth-child("+i+") > td:nth-child(2) > a");
      
          await page.waitForSelector("#markettable > tbody > tr:nth-child("+i+") > td:nth-child(2) > a.btn.btn-sm.btn-danger");
          await page.click("#markettable > tbody > tr:nth-child("+i+") > td:nth-child(2) > a.btn.btn-sm.btn-danger");
          
          console.log("Bought: "+name+" "+price);
          await page.waitForTimeout(3000);
          //await browser.disconnect();

        }  
        
      }

    }
    /*gitMetrics = await page.metrics();
    console.log(gitMetrics.Timestamp);
    console.log(gitMetrics.TaskDuration);*/

    startOver();
  }

})();
