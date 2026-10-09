# ETF v kostce

Česká mobilní landing page pro návštěvníka, který zná základy ETF a přichází z reklamy. Hlavní nabídka je srovnání pěti ETF na americké akcie a ukázka žádosti o PDF přehled. E-mail se žádá **až po veřejně dostupném interaktivním srovnání**. Pořadí hero → vysvětlení burzy a aktiv → srovnání → formulář ukazuje hodnotu nabídky dříve než žádá kontakt.

Jde o omezenou demonstraci konverzní cesty. **PDF se nevytváří ani nedoručuje.** Úspěšná odpověď Formspree potvrzuje pouze přijetí kontaktu API, nikoli doručení PDF. Před skutečnou reklamní kampaní je nutné doručování doplnit.

Dvě konkrétní české reklamy včetně textu, titulku, CTA, vizuálu a návaznosti hero jsou v [ads.md](ads.md). Hero odpovídá oběma variantám. Záznam práce s Codexem je v [ai-log/codex-konverzace.md](ai-log/codex-konverzace.md); zadavatel nepoužil Claude Code, proto nelze dodat jeho `/export`. Jde o ručně vedený záznam, nikoli automatický export.

## Spuštění a sestavení

Požadováno Node.js 20.19+ nebo 22.12+ (podle upozornění Vite 8 při buildu).

```bash
npm ci
cp .env.example .env.local
# V .env.local nastavte vlastní veřejný endpoint Formspree.
npm run dev
npm run lint
npm run build
npm run preview
npm run test:smoke
```

Bez skutečného `VITE_FORMSPREE_ENDPOINT` je formulář úmyslně vypnutý a ukáže chybějící konfiguraci. Příklad v `.env.example` není funkční adresa. `.env` a `.env.local` jsou ignorovány Gitem. Pro sestavení statického webu je výstup v `dist/`; na hostingu nastavte build `npm run build`, výstupní adresář `dist` a `VITE_FORMSPREE_ENDPOINT` jako build-time proměnnou.

## Pět ETF a zdroje

Kontrola 9. 10. 2026. Všechny níže uvedené číselné hodnoty a názvy jsou z oficiálních factsheetů emitenta **platných k 30. 6. 2026**. Nákladovost je ukazatel expense ratio z prospektu citovaného v těchto factsheetech, nikoli poplatek brokera. „Aktiva ETF“ jsou ETF total net assets, nikoli aktiva celé třídy fondu; na webu jsou zaokrouhlena z milionů na miliardy USD. Počet akcií patří portfoliu ETF. Výplata dividend je podle údaje „Dividend schedule: Quarterly“; jde o výplatu, nikoli akumulaci. Popisy rizik jsou stručné redakční interpretace složení či zaměření jednotlivých fondů a nejsou kvantitativním hodnocením rizika. Živou cenu ani výnos nezobrazujeme. Měna aktiv (USD) není totéž co obchodní měna; obchodní měna není na stránce tvrzena, protože použitý factsheet ji výslovně neuvádí. ISIN proto také neuvádíme.

| Ticker | Název dle factsheetu | Kotovací burza | Zaměření / index | Nákladovost | Aktiva ETF, mil. USD | Počet akcií | Primární zdroj metrik |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
| VOO | Vanguard S&P 500 ETF | NYSE Arca | S&P 500 Index | 0,03 % | 978 960 | 506 | [Vanguard F0968](https://fund-docs.vanguard.com/F0968.pdf) |
| VUG | Vanguard Growth ETF | NYSE Arca | CRSP US Large Cap Growth Index | 0,03 % | 223 246 | 147 | [Vanguard F0967](https://fund-docs.vanguard.com/F0967.pdf) |
| VTV | Vanguard Value ETF | NYSE Arca | CRSP US Large Cap Value Index | 0,03 % | 186 106 | 308 | [Vanguard F0966](https://fund-docs.vanguard.com/F0966.pdf) |
| VB | Vanguard Small-Cap ETF | NYSE Arca | CRSP US Small Cap Index | 0,03 % | 81 537 | 1 311 | [Vanguard F0969](https://fund-docs.vanguard.com/F0969.pdf) |
| VIG | Vanguard Dividend Appreciation ETF | NYSE Arca | S&P U.S. Dividend Growers Index TR | 0,04 % | 110 165 | 332 | [Vanguard F0920](https://fund-docs.vanguard.com/F0920.pdf) |

U každého ETF factsheet uvádí ticker, název, „Exchange NYSE Arca“, index, expense ratio, aktiva ETF, počet akcií a čtvrtletní distribuci. Každá metrika v tabulce a aplikaci má tedy odkaz na příslušný dokument ve stejném řádku; přesná URL jsou také v `src/etfs.ts`. Pro porovnání stavu burzy jsou uvedeny stránky NYSE: [VOO](https://www.nyse.com/quote/ARCX:VOO), [VUG](https://www.nyse.com/quote/ARCX:VUG), [VTV](https://www.nyse.com/quote/ARCX:VTV), [VB](https://www.nyse.com/quote/ARCX:VB), [VIG](https://www.nyse.com/quote/ARCX:VIG) a [adresář ETF](https://www.nyse.com/listings_directory/etf). Jejich záznamy se ale v dostupném textovém nástroji vykreslují pouze JavaScriptem, takže **aktuální název u NYSE nebylo možné nezávisle potvrdit z obsahu adresáře**. Starší [oficiální oznámení NYSE Arca](https://www.nyse.com/publicdocs/nyse/markets/nyse-arca/rule-interpretations/2008/NYSEArca-RB-08-95.pdf) výslovně uvádí VUG, VTV, VB a VIG při převodu kotace; u VOO je dostupná [oficiální stránka NYSE z roku 2026](https://tv.nyse.com/2026-nyse-opening-bell/events/the-nyse-welcomes-vanguard-to-celebrate-the-50th-anniversary-of-the-vanguard-500-index-fund) s označením „NYSE Arca: VOO“. Factsheety Vanguard potvrzují NYSE Arca všech pěti k datu jejich platnosti. Před ostrým použitím je vhodné ověřit aktuální záznamy v interaktivním adresáři NYSE; Vanguard mezitím na některých webových profilech používá nové názvy s „Morningstar“ po oznámeném přejmenování v červenci 2026. Zde jsou vědomě použity názvy a indexy dokumentované k 30. 6. 2026.

Výběr neověřuje dostupnost pro českého retailového investora, registraci UCITS ani PRIIPs KID. Nákup závisí na brokerovi, jurisdikci a typu investora. Jde o obecné srovnání, ne individuální investiční doporučení; minulý výnos nezaručuje budoucí výsledek.

## Formulář a osobní údaje

1. V účtu [Formspree](https://formspree.io/) založte formulář a zkopírujte jeho veřejný endpoint `https://formspree.io/f/…` do `VITE_FORMSPREE_ENDPOINT`. Bez něj není integrace ověřena a formulář zůstává vypnutý.
2. Před aktivací doplňte ve stránce provozovatele a kontakt, dobu uchování, potvrďte účel a nastavení služby. Tato data zadavatel zatím neposkytl a jsou označena `[DOPLNIT PŘED OSTRÝM PROVOZEM]`. Bez nich není stránka připravena na ostrý sběr kontaktů.
3. Otevřete stránku, odešlete vlastní testovací e-mail a ověřte přijetí v účtu Formspree. Úspěch na stránce se ukáže jen při HTTP 2xx. Testujte také neplatný e-mail, pomalou síť, síťovou chybu, HTTP 429 a jiný HTTP error; chyba má dovolovat opakování. Nepoužívejte cizí adresy při testu.

Do API se odesílá pouze `email`. Marketingový souhlas ani další účel zde nejsou implementovány; žádný checkbox se proto nevydává za souhlas. E-mail není součástí analytických událostí ani AI logu.

## Měření cesty

Adaptér `src/tracking.ts` ukládá události jen lokálně do `window.etfTrackingEvents` a ve vývojovém režimu je vypisuje do konzole. **Vzdálená analytika není zapnutá** a současný adaptér nepoužívá cookies. Z URL se zachovají `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` a `ad_variant` u každé události v rámci návštěvy, včetně výsledku podání. Hodnoty e-mailu se nikdy neukládají. Pokud bude napojená vzdálená analytická služba, je třeba ji zapnout až podle platných pravidel souhlasu a ověřit přenos v jejím debug rozhraní.

| Událost | Spouštěč | Další údaje |
| --- | --- | --- |
| `landing_view` | první zobrazení aplikace | UTM, varianta reklamy, fáze `landing` |
| `compare_start` | první změna výběru fondů | původní tickery, fáze `comparison` |
| `compare_change` | každá skutečná změna výběru | nové tickery, fáze `comparison` |
| `lead_cta_click` | kliknutí na CTA za srovnáním | vybrané tickery, fáze `lead` |
| `lead_form_view` | formulář vstoupí do viditelné části obrazovky | vybrané tickery, fáze `lead` |
| `lead_submit_attempt` | pokus o odeslání | vybrané tickery, fáze `lead` |
| `lead_submit_success` | odpověď API HTTP 2xx | vybrané tickery, fáze `lead` |
| `lead_submit_error` | validace, konfigurace, síť, 429 či jiný HTTP error | vybrané tickery, fáze `lead`, typ chyby |

Pracovní **hypotéza konverze je 3 %**, nikoli naměřený výsledek. Jmenovatel: unikátní návštěvy s `landing_view` v dané kampani. Čitatel: unikátní návštěvy s `lead_submit_success` ze stejné kampaně. Bez vzdálené analytiky nelze tuto míru zatím spolehlivě změřit mezi návštěvníky.

Hypotézy A/B testů v pořadí očekávaného dopadu: (1) reklama a hero zdůrazňující konkrétní rozdíly fondů proti verzi podle investičních stylů; (2) délka cesty od prvního srovnání k formuláři; (3) podoba náhledu všech pěti fondů v hero. Vyhodnocovat pouze po doplnění skutečného doručování a měření.

## Ověření a nasazení

`npm run lint` a `npm run build` kontrolují zdrojový kód a produkční sestavení. `npm run test:smoke` potřebuje lokální Google Chrome, Node.js s přepínačem `--experimental-websocket` a volné porty 5317/9327; spustí skutečný prohlížeč a pouze v testu nahradí HTTP odpovědi Formspree. Ověřuje mobilní šířku, výběr klávesnicí, události, validaci, čekání, 429, síťovou chybu, opakování a úspěch po HTTP 200. Ruční kontrolní cesta: otevřít odkaz reklamy s UTM na mobilní šířce, číst hero, klávesnicí vybrat dvě ETF, ověřit změnu tabulky, přejít CTA k formuláři, zkusit chybový i úspěšný stav a zkontrolovat `window.etfTrackingEvents`. Skutečný úspěšný stav zatím **nebyl ověřen**, protože chybí reálný endpoint. Mobilní (390 px) a desktopové (1365 px) zobrazení bylo vizuálně zkontrolováno v headless Chrome; automatický test potvrdil ovládání výběru klávesnicí a nulové vodorovné přetečení na mobilní šířce.

Veřejný GitHub repozitář: [Elfkam/clientelo](https://github.com/Elfkam/clientelo). Veřejná URL nasazení: po nasazení doplnit. Bez přístupu k hostingu a bez údajů pro ostrý formulář se nesmí tvrdit, že web nebo sběr kontaktů běží veřejně. Školní ukázku lze hostovat jako statický web se zakázaným formulářem. Pro ostrou reklamní kampaň je nutné doplnit doručování PDF, osobní údaje provozovatele, skutečný Formspree endpoint, vhodnou analytiku a vhodný hosting. [Podmínky Vercel](https://vercel.com/legal/terms) uvádějí, že bezplatný Hobby je jen pro osobní či nekomerční použití; pro komerční kampaň je potřeba vhodný plán nebo jiné vhodné řešení.
