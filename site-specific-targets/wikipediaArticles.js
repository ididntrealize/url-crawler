const cheerio = require('cheerio');

//custom data modifier functions
const dataMod = require('../dataModify.js');

module.exports = class wikipediaArticles {
    
    introduction(debug, html, item, scrapeReportData) {
        let $ = cheerio.load(html)

        //use developer tools on one of your site links to create your own target
        let target = $('#mw-content-text > div.mw-parser-output > p:nth-child(9)', html);
        let target2 = $('#mw-content-text > div.mw-parser-output > p:nth-child(14)', html);
        
        if (target.length > 0 && $(target).text().trim() != "") {
            target.each(function() {

                if($(this).length > 0) {
                    if(debug) { console.log(`\n\n${this.name}:\n`, $(this).text()); }
                    item.introduction = $(this).text();
                    return false;

                } else {
                    //target doesnt exist on page
                    if( scrapeReportData.missingData[this.name] == undefined) {
                        scrapeReportData.missingData[this.name] = []
                    }
                    scrapeReportData.missingData[this.name].push(item['link']);

                    if(debug) { console.log('target doesnt exist for item: ', item['name']) }
                }
                
            });
        } else if (target2.length > 0 && $(target2).text().trim() != "") {
            target2.each(function() {

                if($(this).length > 0) {
                    if(debug) { console.log(`\n\n${this.name}:\n`, $(this).text()); }
                    item.introduction = $(this).text();
                    return false;

                } else {
                    //target doesnt exist on page
                    if( scrapeReportData.missingData[this.name] == undefined) {
                        scrapeReportData.missingData[this.name] = []
                    }
                    scrapeReportData.missingData[this.name].push(item['link']);

                    if(debug) { console.log('target doesnt exist for item: ', item['name']) }
                }
                
            });
        } else {
            //target doesnt exist on page
            if( scrapeReportData.missingData[this.name] == undefined) {
                scrapeReportData.missingData[this.name] = []
            }
            scrapeReportData.missingData[this.name].push(item['link']);

            if(debug) { console.log('target doesnt exist for item: ', item['name']) }
        }
    }

       

}