const { test, expect } = require("@playwright/test");
const { saveHackerNewsArticles } = require('../utils/saveHackerNewsArticles');
const path = require("path");
const fs = require("fs");
const he = require("he");

// Define the path to the csvfile folder
const csvfileFolderPath = path.join(__dirname, "../csvfile");

// Ensure that the csvfile folder exists, if not create it
if (!fs.existsSync(csvfileFolderPath)) {
  fs.mkdirSync(csvfileFolderPath);
}


const filePath = path.join(csvfileFolderPath, "test_hacker_news.csv");

test("Hacker News scraping function retrieves articles and saves them to CSV", async () => {
  // Run your function to scrape Hacker News articles
  await saveHackerNewsArticles(5, "test_hacker_news.csv");

  // Read the content of the CSV file directly
  const csvContent = fs.readFileSync(filePath, { encoding: "utf-8" });

  // Split the CSV content into lines
  const expectedLines = [
    "Top 5 articles and their url",
   "1. Monolith – CLI tool for saving complete web pages as a single HTML file, https://github.com/Y2Z/monolith",
    "2. Weather Planning for Eclipse Day, https://eclipsophile.com/eclipse-day-weather/",
    "3. PSChess – A chess engine in PostScript, https://seriot.ch/projects/pschess.html",
    "4. Aegis v3.0 – a free, secure and open source 2FA app for Android, https://github.com/beemdevelopment/Aegis/releases/tag/v3.0",
    "5. TinySSH is a small SSH server using NaCl, TweetNaCl, https://github.com/janmojzis/tinyssh"
    
  ];

  // Split the expected lines and decode HTML entities
  const decodedExpectedLines = expectedLines.map((line) => he.decode(line));

  // Split the CSV content into lines
  const actualLines = csvContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  // Decode HTML entities in each line
  const decodedLines = actualLines.map((line) => he.decode(line));

  // Assert that the number of lines match
  expect(decodedLines.length).toBe(decodedExpectedLines.length);

  // Assert that each line matches exactly
  for (let i = 0; i < decodedExpectedLines.length; i++) {
    expect(decodedLines[i]).toBe(decodedExpectedLines[i]);
  }
});
