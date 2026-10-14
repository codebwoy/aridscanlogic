/**
 * MarketDataProvider — licensed/third-party adapters only.
 * Never scrape Amazon.
 */

export class MarketDataProvider {
  get id() {
    return 'base'
  }

  async searchNiches(_filters) {
    throw new Error('not implemented')
  }

  async competitorMeta(_asinOrTopic) {
    throw new Error('not implemented')
  }
}
