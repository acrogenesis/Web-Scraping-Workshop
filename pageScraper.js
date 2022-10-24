const scraperObject = {
  url: 'https://www.senado.gob.mx/64/senadores/directorio_de_senadores',
  async scraper (browser) {
    let page = await browser.newPage()
    console.log(`Navigating to ${this.url}...`)
    // Navigate to the selected page
    await page.goto(this.url)
    let scrapedData = []
    // Wait for the required DOM to be rendered
    await page.waitForSelector('.container-fluid')
  }
}

module.exports = scraperObject
