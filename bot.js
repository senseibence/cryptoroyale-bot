const puppeteer = require("puppeteer");

//http://127.0.0.1:9222/json/version
//--disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding

(async () => {
  
  const link = 'paste in here the link after "websocketdebuggerurl"';
  const browser = await puppeteer.connect({
    headless: true,
    defaultViewport: null,
    browserWSEndpoint: link,
  });

  const page = await browser.newPage();
  
  await page.goto("https://cryptoroyale.one/skins/?m=marketplace", {
    waitUntil: "networkidle2",
  })

  //right below commented out is for automated search box and price filter, but I would recommend just preloading the page

  /*await page.waitForSelector('input[class=""]');
  
  await page.type('input[class=""]', "burger", {
    delay: 5,
  });

  await page.waitForSelector('th[aria-label="Price: activate to sort column ascending"]');
  await page.click('th[aria-label="Price: activate to sort column ascending"]');*/

  await page.waitForSelector("#markettable > tbody > tr:nth-child(1) > td:nth-child(9)");

  const prices = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("#markettable > tbody > tr:nth-child(1) > td:nth-child(9)")).map(x => x.textContent);
  })

  //really shitty way that I derived the price; can be made more efficient
  const str = ""+prices[0];
  let newStr = "";
  for (let i = 0; i < str.length-1; i++){
    if (str.substring(i,i+1) === ",") continue;
    newStr += str.substring(i,i+1);
  }

  //adjust your target price
  if (parseInt(newStr) < 1200) {
    
    await page.waitForSelector('a[class="btn btn-sm btn-light"]');
    await page.click('a[class="btn btn-sm btn-light"]');
    
    await page.waitForSelector('a[class="btn btn-sm btn-danger"]');
    await page.click('a[class="btn btn-sm btn-danger"]');

    await page.waitFor(3000) //deprecated code (will still work), I added this to make sure the purchase went through, but it can be removed
    await browser.disconnect(); //you can either disconnect from the browser (stop everything) or call "startOver()" if you want to buy multiple skins --> run until you manually stop it
    //await browser.close();
  }

  startOver();
  
  async function startOver(){
    await page.reload({
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("#markettable > tbody > tr:nth-child(1) > td:nth-child(9)");

    const prices = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("#markettable > tbody > tr:nth-child(1) > td:nth-child(9)")).map(x => x.textContent);
    })
  
    const str = ""+prices[0];
    let newStr = "";
    for (let i = 0; i < str.length-1; i++){
      if (str.substring(i,i+1) === ",") continue;
      newStr += str.substring(i,i+1);
    }

    if (parseInt(newStr) < 1200) {
    
      await page.waitForSelector('a[class="btn btn-sm btn-light"]');
      await page.click('a[class="btn btn-sm btn-light"]');
  
      await page.waitForSelector('a[class="btn btn-sm btn-danger"]');
      await page.click('a[class="btn btn-sm btn-danger"]');
  
      await page.waitFor(3000) //to clarify, this waits for 3 seconds
      await browser.disconnect(); //I disconnect because I only want to buy one cheap skin
      //await browser.close();
    }
 
    startOver();

  }

  
})(); //all of the "waitForSelectors" might not actually do anything and may need to be modifed for efficiency. It seems to work just fine for me, but there is room for improvement

