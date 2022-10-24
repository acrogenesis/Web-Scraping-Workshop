const scraperObject = {
  url: 'https://www.senado.gob.mx/64/senadores/directorio_de_senadores',
  async scraper (browser) {
    let page = await browser.newPage()
    console.log(`Navigating to ${this.url}...`)
    // Navigate to the selected page
    await page.goto(this.url, { timeout: 0 })
    let scrapedData = []
    // Wait for the required DOM to be rendered
    await page.waitForSelector('.container-fluid')

    let urls = await page.$$eval('td.text-left a', links => {
      console.log(links)
      // Extract the links from the data
      links = links.map(el => el.href)
      // Filter the links to get only the ones that are a profile
      links = links.filter(el =>
        el.match(/^https:\/\/www\.senado\.gob\.mx\/64\/senador\/\d{0,4}$/)
      )
      // Remove duplicates
      links = [...new Set(links)]
      return links
    })
    console.log('urls', urls)

    // Comment this line if you want to scrape all the senators
    urls = urls.slice(0, 2)

    // Loop through each of those links, open a new page instance and get the relevant data from them
    let pagePromise = link =>
      new Promise(async (resolve, reject) => {
        let dataObj = {}
        let newPage = await browser.newPage()
        await newPage.goto(link, { timeout: 0 })
        dataObj['fullName'] = await newPage.$eval(
          '.profileName',
          text => text.textContent.match(/^Senado\w*\s(.+)$/)[1]
        )
        dataObj['profile'] = await newPage.$eval(
          '.profileImg > img',
          img => img.src
        )
        dataObj['party'] = await newPage.$eval('.profileFooter > table', text =>
          text.textContent.trim()
        )
        // Here you can parse more data from each senator's page
        // ...

        resolve(dataObj)
        await newPage.close()
      })

    for (link in urls) {
      let currentPageData = await pagePromise(urls[link])
      scrapedData.push(currentPageData)
      console.log(currentPageData)
    }
    // Faster but consumes more memory and network bandwidth
    // await Promise.all(
    //   urls.map(async link => {
    //     let currentPageData = await pagePromise(link)
    //     scrapedData.push(currentPageData)
    //     console.log(currentPageData)
    //   })
    // )
    return scrapedData
  }
}

module.exports = scraperObject
