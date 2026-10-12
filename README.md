# ETF v kostce

Česká mobilní landing page pro návštěvníka, který zná základy ETF a přichází z reklamy. Hlavní nabídka je srovnání pěti ETF na americké akcie a ukázka žádosti o PDF přehled. Ukázkový e-mailový formulář následuje **až po veřejně dostupném interaktivním srovnání**. Pořadí hero → vysvětlení burzy a aktiv → srovnání → formulář ukazuje hodnotu nabídky dříve než žádá kontakt.

Ve srovnání je pět konkrétních ETF. Odkaz „Zobrazit více ETF“ vede z mobilního i počítačového zobrazení k formuláři a zaměří e-mailové pole.

Jde o omezenou demonstraci konverzní cesty. **E-mail se nikam neposílá ani neukládá a PDF se nevytváří ani nedoručuje.** Po platné adrese se na jednu sekundu zobrazí načítání a poté potvrzení dokončení ukázky. Před skutečnou reklamní kampaní je nutné doručování a zpracování kontaktů samostatně doplnit.

Dvě konkrétní české reklamy včetně textu, titulku, CTA, vizuálu a návaznosti hero jsou v [ads.md](ads.md). Hero odpovídá oběma variantám. Záznam práce s Codexem je v [ai-log/codex-konverzace.md](ai-log/codex-konverzace.md); zadavatel nepoužil Claude Code, proto nelze dodat jeho `/export`. Jde o ručně vedený záznam, nikoli automatický export.

## Spuštění a sestavení

Požadováno Node.js 20.19+ nebo 22.12+ (podle upozornění Vite 8 při buildu).

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

Není potřeba nastavovat endpoint ani proměnnou prostředí. Produkční sestavení je v `dist/`; ukázkový formulář v něm také nic neodesílá.

## Styly

Globální barvy, písma, šířka obsahu a základní typografie jsou v `src/styles/global.css`. Sdílené tlačítko a rozvržení sekcí jsou v `src/styles/shared.module.css`. Každá komponenta v `src/components/` má vlastní CSS modul se svými styly a media queries.

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

## Formulář a soukromí

Platnost povinného e-mailu kontroluje přímo prohlížeč pomocí HTML formuláře. Povinný checkbox souhlasu zpřístupní tlačítko až po zaškrtnutí; odkaz v jeho textu je zatím neaktivní a nikam nevede. Po platném odeslání formulář na jednu sekundu zobrazí načítání a potom potvrzení místní ukázky. Nevolá síťové API, adresu neukládá a neposílá ji do analytiky. Checkbox je pouze součástí ukázky, protože žádné údaje se ve formuláři nezpracovávají na serveru. Ve `src/leadAjaxExample.ts` je kompletně zakomentovaná AJAX funkce, která by v budoucnu poslala adresu na endpoint předaný parametrem. Nikde se nevolá; bez skutečného endpointu nelze doložit přijetí kontaktu ani doručení PDF.

Před zapnutím skutečného sběru by bylo nutné doplnit provozovatele, kontakt, účel, dobu uchování a informaci o službě, která by adresy zpracovávala. Tyto údaje zadavatel zatím nemá. Současná stránka žádné kontakty nesbírá.

## Měření cesty

Adaptér `src/tracking.ts` ukládá události jen lokálně do `window.etfTrackingEvents` a ve vývojovém režimu je vypisuje do konzole. **Vzdálená analytika není zapnutá** a současný adaptér nepoužívá cookies. Z URL se zachovají `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` a `ad_variant` u každé události v rámci návštěvy, včetně dokončení ukázky. Hodnoty e-mailu se nikdy neukládají. Pokud bude napojená vzdálená analytická služba, je třeba ji zapnout až podle platných pravidel souhlasu a ověřit přenos v jejím debug rozhraní.

| Událost | Spouštěč | Další údaje |
| --- | --- | --- |
| `landing_view` | první zobrazení aplikace | UTM, varianta reklamy, fáze `landing` |
| `compare_start` | první změna výběru fondů | původní tickery, fáze `comparison` |
| `compare_change` | každá skutečná změna výběru | nové tickery, fáze `comparison` |
| `lead_cta_click` | kliknutí na odkaz „Zobrazit více ETF“ | vybrané tickery, fáze `lead` |
| `lead_form_view` | formulář vstoupí do viditelné části obrazovky | vybrané tickery, fáze `lead` |
| `lead_demo_attempt` | pokus spustit ukázku | vybrané tickery, fáze `lead` |
| `lead_demo_complete` | dokončení po jedné sekundě | vybrané tickery, fáze `lead` |

Pracovní **hypotéza konverze pro budoucí skutečný sběr je 3 %**, nikoli naměřený výsledek. Jmenovatel: unikátní návštěvy kampaně. Čitatel: unikátní návštěvy, jejichž kontakt by skutečná služba přijala. Událost `lead_demo_complete` měří jen dokončení ukázky a za přijatý kontakt se nepovažuje. Bez skutečného sběru a vzdálené analytiky tuto míru nelze změřit.

Hypotézy A/B testů v pořadí očekávaného dopadu: (1) reklama a hero zdůrazňující konkrétní rozdíly fondů proti verzi podle investičních stylů; (2) délka cesty od prvního srovnání k formuláři; (3) podoba náhledu všech pěti fondů v hero. Vyhodnocovat pouze po doplnění skutečného doručování a měření.

## Ověření a nasazení

`npm run lint` a `npm run build` kontrolují zdrojový kód a produkční sestavení. Ruční kontrola: otevřít stránku na mobilu i počítači, porovnat dvě ETF, kliknout na odkaz „Zobrazit více ETF“ a ověřit přechod k formuláři, zaměření e-mailového pole a zachování výběru ETF. Poté vyzkoušet nativní validaci e-mailu, checkbox a sekundové načítání. Dokončení ukázky není potvrzením přijetí kontaktu ani doručení PDF.

Veřejný GitHub repozitář: [Elfkam/clientelo](https://github.com/Elfkam/clientelo). Aktuální změny jsou pouze lokální: podle posledního pokynu zadavatele se nic necommituje ani nenasazuje. Pro ostrou reklamní kampaň je potřeba samostatně doplnit skutečné doručování, údaje provozovatele, vhodnou analytiku a hosting. Výběr ETF neověřuje dostupnost pro české retailové investory.
