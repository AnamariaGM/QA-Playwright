const { chromium } = require("playwright");
const fs = require("fs");
const he= require('he')
const path=require('path')

async function saveHackerNewsArticles(numArticles = 10,
  csvFileName = "hacker_news_top_10.csv"
) {
  try {
    if (!Number.isInteger(numArticles) || numArticles <= 0) {
      throw new Error("Number of articles must be a positive integer");
    }

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();


    await page.goto("https://news.ycombinator.com/");


    // Loading articles
    await page.waitForSelector("#hnmain > tbody > tr:nth-child(3) > td > table > tbody > tr.athing"
    );

    // select items that match the selector
    const selector = await page.$$(
      "#hnmain > tbody > tr:nth-child(3) > td > table > tbody > tr.athing > td.title > span >a"
    );

    // declare an articles object to save the titles and urls
    const articles = {};

    // Saving the title and url for each element found and save it to articles object as key and value pair
    for (let i = 0; i < numArticles; i++) {
      const title = await selector[i].evaluate((element) => element.innerText);
      const url = await selector[i].evaluate((element) => element.href);
      articles[title] = url;
    }

    // Invoke writeArticleToCSV function
    // passing the articles object and the csvFileName as arguments
    await writeArticlesToCSV(articles, csvFileName);

    // closing the browser
    await browser.close();

    console.log(`Top ${numArticles} articles saved to ${csvFileName}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Function that write the elements from the object into the csv file
async function writeArticlesToCSV(articles, filename) {

  const directoryPath = path.join(__dirname, "csvfile");

  // Create the new folder if it doesn't exist
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  // Define the file path within the new folder
  const filePath = path.join(directoryPath, filename);

  // Create a write stream for the file
  const fileStream = fs.createWriteStream(filePath);

  fileStream.write(
    `Top ${Object.keys(articles).length} articles and their url\n\n`
  );
  let index = 1;
  for (const title in articles) {
    if (articles.hasOwnProperty(title)) {

      const url = articles[title];
      const decodedTitle = he.decode(title); // Decode HTML entities in title
      console.log(decodedTitle, url);
      fileStream.write(`${index}. ${decodedTitle}, ${url}\n`);
      index++;
    }
  }
  fileStream.end();
}

module.exports={ saveHackerNewsArticles}