// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

async function startBrowser () {
  let browser
  try {
    console.log('Opening the browser......')
    browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
      executablePath: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` // MacOS path
    })
  } catch (err) {
    console.log('Could not create a browser instance => : ', err)
  }
  return browser
}

module.exports = {
  startBrowser
}
