const puppeteer = require('puppeteer');
const fs = require('fs');
//custom data modifier functions
const dataMod = require('./dataModify.js');

/*
    START
    CONFIG 
    VARIABLES
*/
let debug = true;
let printResultsToFile = true;
let hideBrowser = true;

//set to false for full scrape or int (ex: 10) for testing with reports
let limitPagesToScrape = false; 

//This string must have corresponding 
    //-Targeting Class (ex: /site-specific-targets/durkeeBrokers.js)
    //-input json (ex: /imports/durkeeBrokers.json)
let currentScrapePrefix = "wikipediaArticles";

//create a json file in the imports directory with (at least) a link to a scrapeable page per item.
//replace the require URL with your new file name
    //ex: [{"link": "https://coreyb.org"}, {"link": "https://ididntrealize.com"}]
const startingJson = require('./imports/' + currentScrapePrefix + '.json');

//create a new JS file with the specific targets needed to scrape as methods of a class
//replace the require URL with your new file name
const SiteSpecificTargets = require('./site-specific-targets/' + currentScrapePrefix + '.js');
let siteTargets = new SiteSpecificTargets();

/*
    END
    CONFIG 
    VARIABLES
*/


//copy import file to add fields to for final dump
let updatedJson = JSON.parse(JSON.stringify(startingJson));

//REPORT DATA OBJ - reports on any missing fields per link and returns a list on completion
let scrapeReportData = {
    uniqueDomainOrigins : [],
    pageLoadError : [],
    missingData: {
        //title: ['url.com/1', 'url.com/2']
    }
};

//START MAIN FUNCTION
(async () => {
    const browser = await puppeteer.launch({ headless: hideBrowser });
    console.log("SCRAPING STARTED AT " + dataMod.getDateString());

    let i = 0;
    for ( let item of updatedJson ) {
        i++;
        //LIMIT NUMBER OF PAGES FROM CONFIG
        if ( limitPagesToScrape && i > parseInt(limitPagesToScrape) ) {
            break;
        }

        if (debug) {
            console.log('\n\n\n\n-----------------');
            console.log('\nPAGE ' + i + ' OF ' + updatedJson.length)
            console.log(item.name ? item.name + '\n': null);
            console.log(item.link);
        } else {
            console.log('\n' + i + '/' + updatedJson.length)
        }
        
        const page = await browser.newPage();

        try {
            await page.goto(`${item.link}`, { waitUntil: 'networkidle2' });
            console.log(`SCRAPING PAGE:\n  ${item.name ? item.name : item.link}`);
        } catch(e) {
            //keep error for final report
            scrapeReportData.pageLoadError.push(item['link'])
            console.log(e.message);
        }
        
        const html = await page.content();

        //COMPILE LIST OF DOMAINS USED
        let currDomain = dataMod.getDomain(item.link);
        if (scrapeReportData.uniqueDomainOrigins.indexOf(currDomain) < 0) {
            scrapeReportData.uniqueDomainOrigins.push(currDomain);
        }

        //Here's where the magic happens
        //SCRAPE FIELDS FROM SITE TARGET FILE 
        for (const property of Object.getOwnPropertyNames(SiteSpecificTargets.prototype)) {
            if( typeof siteTargets[property] === 'function' && property != "constructor") {
                if(debug) { console.log('\n\nSiteSpecificTargets: should capture field: ', property) }
                siteTargets[property].bind(siteTargets[property])(debug, html, item, scrapeReportData);
            }

        }

        //NO MORE FIELDS TO SCRAPE ON THIS PAGE
        await page.close();
    }

    //VERBOSE REPORT
    if(debug) { 
         
        //HERE'S THE NEW JSON OBJECT WITH ALL ADDED FIELDS:
        console.log('=============\n PREVIEW OLD OBJECT: \n');
        console.log(startingJson[0]);

        //HERE'S THE NEW JSON OBJECT WITH ALL ADDED FIELDS:
        console.log('\n\n=============\n PREVIEW OBJECT PLUS ADDED FIELDS: \n');
        console.log(updatedJson[0]);

    }

    console.log('\n\n\n\n\n\n__________________\nCompleted scrape! \n======================\n\nGENERAL STATS:\n');

    let scrapeReport = "";
    for (const [key, value] of Object.entries(scrapeReportData)) {
        if(value && (value.length > 0 || Object.entries(value).length > 0 )) {
            console.log(`--------------\n${key}: `);
            console.log(`  ${JSON.stringify(value, null, 2)}\n\n`);

            if(typeof(value) == "object") {
                scrapeReport += "\n\n" + key + "\n------\n";
                scrapeReport += `${JSON.stringify(value, null, 2)}`;

            } else if(typeof(value) == "array") {
                //add data to scrape report file string
                scrapeReport += key + "\n\n  " + value;
            } 
            
        }
    }
    
    if (printResultsToFile) {
        //Write scraped data to new file with timestamp
        await fs.promises.writeFile(`exports/${currentScrapePrefix}-${dataMod.getDateString()}.json`, JSON.stringify(updatedJson));
        //write report on scrape to file with timestamp
        await fs.promises.writeFile(`logs/report-${currentScrapePrefix}-${dataMod.getDateString()}.txt`, scrapeReport);
    }

    //goodbye world
    await browser.close();
    
})();


