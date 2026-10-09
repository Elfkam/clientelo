export type Etf = {
  ticker: string
  name: string
  focus: string
  index: string
  expenseRatio: string
  assetsMillionsUsd: number
  holdings: number
  dividendSchedule: string
  risk: string
  factSheet: string
  nyseQuote: string
}

// Values are from issuer fact sheets dated June 30, 2026. See README for source scope.
export const etfs: Etf[] = [
  { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', focus: 'Velké americké firmy', index: 'S&P 500 Index', expenseRatio: '0,03 %', assetsMillionsUsd: 978960, holdings: 506, dividendSchedule: 'Čtvrtletně', risk: 'Koncentrace v největších amerických firmách', factSheet: 'https://fund-docs.vanguard.com/F0968.pdf', nyseQuote: 'https://www.nyse.com/quote/ARCX:VOO' },
  { ticker: 'VUG', name: 'Vanguard Growth ETF', focus: 'Velké růstové firmy', index: 'CRSP US Large Cap Growth Index', expenseRatio: '0,03 %', assetsMillionsUsd: 223246, holdings: 147, dividendSchedule: 'Čtvrtletně', risk: 'Vyšší koncentrace v technologických firmách', factSheet: 'https://fund-docs.vanguard.com/F0967.pdf', nyseQuote: 'https://www.nyse.com/quote/ARCX:VUG' },
  { ticker: 'VTV', name: 'Vanguard Value ETF', focus: 'Velké hodnotové firmy', index: 'CRSP US Large Cap Value Index', expenseRatio: '0,03 %', assetsMillionsUsd: 186106, holdings: 308, dividendSchedule: 'Čtvrtletně', risk: 'Odlišný vývoj hodnotových akcií vůči širšímu trhu', factSheet: 'https://fund-docs.vanguard.com/F0966.pdf', nyseQuote: 'https://www.nyse.com/quote/ARCX:VTV' },
  { ticker: 'VB', name: 'Vanguard Small-Cap ETF', focus: 'Menší americké firmy', index: 'CRSP US Small Cap Index', expenseRatio: '0,03 %', assetsMillionsUsd: 81537, holdings: 1311, dividendSchedule: 'Čtvrtletně', risk: 'Kolísání cen menších společností', factSheet: 'https://fund-docs.vanguard.com/F0969.pdf', nyseQuote: 'https://www.nyse.com/quote/ARCX:VB' },
  { ticker: 'VIG', name: 'Vanguard Dividend Appreciation ETF', focus: 'Firmy s růstem dividend', index: 'S&P U.S. Dividend Growers Index TR', expenseRatio: '0,04 %', assetsMillionsUsd: 110165, holdings: 332, dividendSchedule: 'Čtvrtletně', risk: 'Výběr podle dividendové historie omezuje záběr trhu', factSheet: 'https://fund-docs.vanguard.com/F0920.pdf', nyseQuote: 'https://www.nyse.com/quote/ARCX:VIG' },
]

export const factsAsOf = '30. 6. 2026'
