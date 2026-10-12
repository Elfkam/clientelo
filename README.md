# ETF v kostce

Česká mobilní landing page pro návštěvníka, který zná základy ETF a přichází z reklamy. Hlavní nabídka je ve srovnání pěti ETF na americké akcie a v případě zájmu srovnáví vetšího počtu ETF, které jsou obdrženy po vyplnění formuláře.

### Pořadí sekcí:

První sekce **HeroSection** je to, co uživatel vidí po příchodu na náš web. Proto obsahuje výstižný nadpis, aby uživatel hned věděl, co má očekávat. Následuje **ComparisonSection**, která obsahuje srovnání pěti základních ETF a nenápadnou výzvu k získání přehledu dalších ETF. Výzva není příliš výrazná, aby uživatele hned neodradila. Dále následuje **LeadSection** s formulářem, u kterého uživatel předem ví, co obdrží po zadání e-mailu. Na závěr je **SourcesSection**, která obsahuje odkazy pro uživatele, kteří si chtějí informace sami dohledat a ověřit.

### Reklamy

Dvě konkrétní české reklamy včetně textu, titulku, CTA, vizuálu a návaznosti hero jsou v [ads.md](ads.md). Hero odpovídá oběma variantám.

### Konverze

Očekávaný konverzní poměr je odhadován na 5 %, tedy přibližně 5 dokončených formulářů na 100 návštěv stránky. Jde o pracovní hypotézu, kterou bude nutné ověřit na základě návštěvnosti z reklamních kampaní. Ověření proběhne pomocí události `lead_demo_complete`, která zaznamenává dokončení procesu, tedy odeslání e-mailové adresy.

### A/B testování

### Hypotézy pro A/B testování

Hypotézy jsou seřazeny podle předpokládaného dopadu na míru dokončení formuláře.

1. **Konkrétnější nabídka PDF zvýší konverzní poměr.**

    Varianta A nabídne „Podrobnější přehled ETF“. Varianta B konkrétně uvede, co dokument obsahuje: další ETF, jejich náklady a hlavní rizika. Předpokládám, že jasně komunikovaná hodnota dokumentu zvýší motivaci uživatelů zadat e-mailovou adresu.

2. **Konkrétnější text tlačítka zvýší počet dokončených formulářů.**

    Varianta A použije text „Odeslat“, zatímco varianta B nabídne „Získat PDF přehled“. Předpokládám, že text zdůrazňující výsledný přínos bude účinnější než obecné označení akce.

3. **Částečné skrytí porovnávací tabulky zvýší konverzní poměr.**

    Varianta A ponechá celou porovnávací tabulku viditelnou. Varianta B skryje vybrané řádky, například počet akcií v jednotlivých ETF, a nabídne jejich zpřístupnění prostřednictvím PDF dokumentu zaslaného na e-mail. Předpokládám, že omezení dostupných informací zvýší motivaci uživatelů k vyplnění formuláře.

Hlavní metrikou všech testů bude konverzní poměr, tedy podíl dokončených formulářů na celkovém počtu návštěv stránky.

## Práce s AI

Na začátku byl vytvořen soubor `instructions.txt`, který vznikl na základě brainstormingu s ChatGPT. Codex se jeho pokyny řídil během další práce na projektu.

Záznam práce s Codexem je v [ai-log/codex-konverzace.md](ai-log/codex-konverzace.md); zadavatel nepoužil Claude Code, proto nelze dodat jeho `/export`. Jde o vedený záznam, nikoli automatický export.

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

## Formulář

Platnost povinného e-mailu kontroluje přímo prohlížeč pomocí HTML formuláře. Povinný checkbox souhlasu zpřístupní tlačítko až po zaškrtnutí, odkaz v jeho textu je zatím neaktivní a nikam nevede. Po platném odeslání formulář na jednu sekundu zobrazí načítání a potom potvrzení místní ukázky. Nevolá síťové API, adresu neukládá a neposílá ji do analytiky. Checkbox je pouze součástí ukázky, protože žádné údaje se ve formuláři nezpracovávají na serveru. Ve `src/leadAjaxExample.ts` je kompletně zakomentovaná AJAX funkce, která by v budoucnu poslala adresu na endpoint předaný parametrem.

## Měření cesty

Adaptér `src/tracking.ts` ukládá události jen lokálně do `window.etfTrackingEvents` a ve vývojovém režimu je vypisuje do konzole. Z URL se zachovají `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` a `ad_variant` u každé události v rámci návštěvy, včetně dokončení ukázky.

| Událost              | Spouštěč                                      | Další údaje                           |
| -------------------- | --------------------------------------------- | ------------------------------------- |
| `landing_view`       | první zobrazení aplikace                      | UTM, varianta reklamy, fáze `landing` |
| `compare_start`      | první změna výběru fondů                      | původní tickery, fáze `comparison`    |
| `compare_change`     | každá skutečná změna výběru                   | nové tickery, fáze `comparison`       |
| `lead_cta_click`     | kliknutí na odkaz „Zobrazit více ETF“         | vybrané tickery, fáze `lead`          |
| `lead_form_view`     | formulář vstoupí do viditelné části obrazovky | vybrané tickery, fáze `lead`          |
| `lead_demo_attempt`  | pokus spustit ukázku                          | vybrané tickery, fáze `lead`          |
| `lead_demo_complete` | dokončení po jedné sekundě                    | vybrané tickery, fáze `lead`          |

## Ověření a nasazení

`npm run lint` a `npm run build` kontrolují zdrojový kód a produkční sestavení. Ruční kontrola: otevřít stránku na mobilu i počítači, porovnat dvě ETF, kliknout na odkaz „Zobrazit více ETF“ a ověřit přechod k formuláři, zaměření e-mailového pole a zachování výběru ETF. Poté vyzkoušet nativní validaci e-mailu, checkbox a sekundové načítání. Dokončení ukázky není potvrzením přijetí kontaktu ani doručení PDF.
