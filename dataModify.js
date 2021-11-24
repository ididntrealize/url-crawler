const $ = require('cheerio');

/*
    DATA MOD FUNCTIONS FOR GENERAL USE IN SCRAPING
*/
module.exports =
{
    replaceNewLines,
    removeWpImageResizing,
    replaceRelativeLinksHtml,
    replaceRelativeLink,
    isAbsolute,
    getDateString,
    getDomain,
    stripAttrFromString
  
}

function replaceNewLines(html) {
    let string = JSON.stringify(html);
    let noEscapedNewLines = string.replace(/\\n/g, '');
    let noNewLines = noEscapedNewLines.replace(/\\/g, '');
    let noInnerQuotes = noNewLines.substring(0, noNewLines.length - 1).substring(1);
    return noInnerQuotes;
}

function removeWpImageResizing(link) {
    let newLink = link;
        newLink = newLink
            .replace('-600x400', '')
            .replace('-374x374', '')
            .replace('-450x450', '')
            .replace('-450x350', '');

    return newLink;
}

function replaceRelativeLinksHtml(debug, item, html) {
    
    let newHtml = html;

    let linkRegEx = /href="(.*?)"/g;
    let links = newHtml.match(linkRegEx);

    if (links === null) {
        return html;
    }

    for (let link of links) {
        //get just the URL
        let newLink = link.replace('href="', '');
            newLink = newLink.slice(0, -1);
        let oldLinkUrl = newLink;

        if (!isAbsolute(newLink)) {
            newLink = getDomain(item.link);
            if(oldLinkUrl.charAt(0) !== "/") {
                newLink += "/";
            }
            newLink += oldLinkUrl;
            if(debug) {
                console.log('\nold link is: ', oldLinkUrl);
                console.log('\nnew link is: ', newLink);
            }
            

            //replace with altered string
            newHtml = newHtml.replace(oldLinkUrl, newLink);
        }
    }
    
    if(debug) {
        console.log("\n\n--------------------")
        console.log("\nOLD HTML \n", html)
        console.log("\nNEW HTML \n", newHtml)
    }
    return newHtml;

}

function replaceRelativeLink(debug, item, link) {
    let newLink = link;
    let oldLinkUrl = link;

    if (!isAbsolute(newLink)) {
        newLink = getDomain(item.link);
        if(oldLinkUrl.charAt(0) !== "/") {
            newLink += "/";
        }
        newLink += oldLinkUrl;
        
        if(debug) {
            console.log('\nold link is: ', oldLinkUrl);
            console.log('\nnew link is: ', newLink);
        }

        //replace with altered string
    }
    
    return newLink;
}

function isAbsolute(url){
    return url.indexOf('://') > 0 || url.indexOf('//') === 0 ;;
}

function getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day =`${date.getDate()}`.padStart(2, '0');
    const hour =`${date.getHours()}`.padStart(2, '0');
    const minute =`${date.getMinutes()}`.padStart(2, '0');

    return `${year}-${month}-${day}-${hour}h${minute}m`;
}

function getDomain(url) {
    var m = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img);
    return m ? m[0] : null;
}

function stripAttrFromString(string) {
    let attrList = ['href', 'style', 'id', 'class']
    let newString = string;
    let allElements = $('*', string);

    for (let element of allElements) {
        //remove values from attributes
        for(let attr of attrList) {
            newString = newString.replace($(element).attr(attr), '');
        }
    }
    
    //remove blank lingering attribute names i.e. id=""
    for(let attr of attrList) {
        newString = newString.replace(' ' + attr + '=""', '');
    }
        
    if(debug) {
        console.log('\nremoving attributes in string: ', string);
        console.log('\nreturning function without atts: ', newString);
    }

    return newString;
}