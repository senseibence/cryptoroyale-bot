const puppeteer = require("puppeteer");

/*

what you type into the browser to get the ending string for const "link":
http://127.0.0.1:9222/json/version
(for reference, watch demo video)

what tags you must add via *chromium --> properties* for the bot to work:
--remote-debugging-port=9222 --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding

*/

(async () => {
  
  //add what you got from above after "browser/"
  const link = 'ws://127.0.0.1:9222/devtools/browser/ac177396-227b-47d3-81e4-d5a82a7abbed'; 
  
  //the following are puppeteer settings to make the bot run more efficiently
  const browser = await puppeteer.connect({ 
    headless: true,
    defaultViewport: null,
    browserWSEndpoint: link,
  });

  const page = await browser.newPage();
  
  //go to this url and wait until the page has loaded
  await page.goto("https://cryptoroyale.one/skins/?m=marketplace", { 
    waitUntil: "networkidle2",
  })

  let firstSkin = "wazza";
  startOver(); 
  
  async function startOver(){

    await page.reload({
      waitUntil: "networkidle2",
    });

    /* This is to measure the time between page reloads
    
    let gitMetrics = await page.metrics();
    console.log(gitMetrics.Timestamp);
    console.log(gitMetrics.TaskDuration);
    
    */ 
    
    //filters the marketplace by most recently added
    await page.waitForSelector("#markettable > thead > tr > th:nth-child(4)"); 
    await page.click("#markettable > thead > tr > th:nth-child(4)");
    await page.waitForSelector("#markettable > thead > tr > th:nth-child(4)");
    await page.click("#markettable > thead > tr > th:nth-child(4)");

    //compare first entry on site to "wazza"; beginning of algorithm to check if the newest entry has changed
    await page.waitForXPath('//*[@id="markettable"]/tbody/tr[1]/td[1]/span');
    let [getFirstXPath] = await page.$x('//*[@id="markettable"]/tbody/tr[1]/td[1]/span');
    let firstName = await page.evaluate(getFirstXPath => getFirstXPath.textContent, getFirstXPath);
    //console.log(firstSkin+" vs "+firstName);
    
    //algorithm
    if (firstSkin !== firstName){

      firstSkin = firstName;
      //console.log("\n" + "First five are:");
      
      //this loop checks 5 entries on the site
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

        //console.log(name+" "+price+" "+rarity);

        if //this is where you can change the code to suit your needs
          
        //example
        (((name === "cobra") && (price <= 50000)) ||
        ((name === "shades") && (price <= 7000)) ||
        ((name === "vase") && (price <= 105)) ||
        (price <= 75)) 
        
        {
          
          //if the above conditions are met, then the entry (skin) is purchased
          await page.waitForSelector("#markettable > tbody > tr:nth-child("+i+") > td:nth-child(2) > a");
          await page.click("#markettable > tbody > tr:nth-child("+i+") > td:nth-child(2) > a");
      
          await page.waitForSelector("#markettable > tbody > tr:nth-child("+i+") > td:nth-child(2) > a.btn.btn-sm.btn-danger");
          await page.click("#markettable > tbody > tr:nth-child("+i+") > td:nth-child(2) > a.btn.btn-sm.btn-danger");
          
          //print what was bought and wait 3 seconds for the purchase to go through
          console.log("Bought: "+name+" "+price);
          await page.waitForTimeout(3000);
          //await browser.disconnect();

        }  
        
      }

    }
    
    //self-explanatory 
    startOver();
  }

})();

//console.logs are for you to see if the bot is correctly working
