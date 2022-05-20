
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This project is designed to input a JSON list of links to output JSON with data scraped from each of the links. You can scrape any data that you want, by using site specific targetting (similar method to element targetting with jQuery.js)

Why use this project:
* Start your scraping project right away without having to worry about laying the foundations
* Create targeting methods to execute on every page from your JSON link list
* Use premade data modification methods to perform common data modifications before saving it to your output JSON
* Use config options to decide how to print or save results into timestamped file
* Generate Report on errors and pages where your targetting functions fail

Of course, there are always further optimizations and useful tools to add. You may also suggest changes by forking this repo and creating a pull request or opening an issue. Project made during contract work for Digital Yalo, and expressly given permission to use and share.



<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Node.js](https://nodejs.org/)
* [NPM.js](https://www.npmjs.com/)
* [Puppeteer.js](https://github.com/puppeteer/puppeteer)
* [Cheerio.js](https://cheerio.js.org/)

Thanks to [othneildrew](https://github.com/othneildrew/Best-README-Template/blob/master/README.md) for the readme template

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

1. Clone the repo
   ```sh
   git clone https://github.com/ididntrealize/url-crawler.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create empty folders in root directory:
   ```
   exports/
   logs/
   ```
4. Start example scrape
   ```sh
   node index.js
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Config

Scrape config options are found at the top of the index.js file:
```js
//Default values
debug = true                               //verbose console output per input .json items
printResultsToFile = true                  //after scrape completion, create .json output file in exports/ dir
hideBrowser = true                         //hide browser opening for each link in your input .json
limitPagesToScrape = false                 //set as integer (limitPagesToScrape = 15) to limit number of links to scrape from from inputted link list
currentScrapePrefix = "wikipediaArticles"  //create your own unique scrape title to allow multiple projects running simultaneously
```
<!-- USAGE EXAMPLES -->
## Usage Example

This project includes sample data with links to Wikipedia. It is intended only as an example, but not meant for extended use. <a target="_blank" href="https://www.mediawiki.org/wiki/API:Search">Wikipedia has an API</a> which would be far more efficient than this scraper.

In order to use this application, you must find a way to create a json file with links to pages that you want to scrape. See /imports/wikipediaArticles.json for an example of the required format. Once you have created an import file, you must then create another file of the same name (but different extension) in 
/site-specific-targets/wikipediaArticles.js

The file that you create in /site-specific-targets/ controls what happens once the scraper is on one of the pages that is included in your links from your json import file. You must:
* Change the class name to what your import is named
* Replace the js selector in the variable: target
* Replace .text() methods with .html() as needed

Finally, you will have to edit the index.js file:
* Change currentScrapePrefix to what your import is named. 
* Create /imports/yourScrapePrefix.json
* Create /site-specific-targets/yourScrapePrefix.js

<p align="right">(<a href="#top">back to top</a>)</p>
