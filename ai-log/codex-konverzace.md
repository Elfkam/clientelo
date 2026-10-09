# Průběžný záznam práce s Codexem

Tento soubor je ruční přepis viditelné konverzace a významných kroků, nikoli automatický úplný export. Časy jsou v CEST. Žádná zpráva v dosavadní výměně není záměrně vynechána; technická metadata prostředí a seznam doporučených pluginů nejsou pracovní zadání.

## 2026-10-09 20:55 CEST — UŽIVATEL

> V souboru instructions.txt je podrobný popis toho co potřebuju implementovat. Sestav plán implementace a podle něho postupuj. Kdyby byl něco nejasného, tak nic nevymýšlej ale zeptej se.

## 2026-10-09 20:55 CEST — CODEX

> Přečtu `instructions.txt` a související části projektu, sestavím konkrétní plán a pak začnu implementovat. Pokud narazím na rozhodnutí, které zadání neurčuje a nejde bezpečně odvodit z projektu, zeptám se.

## 2026-10-09 20:56 CEST — CODEX

> Čtení projektu narazilo na chybu izolovaného prostředí (`bubblewrap` a připojení WSL). Zkusím přístup k souborům přes povolenou eskalaci, abych mohl pokračovat v kontrole zadání.

## 2026-10-09 20:57 CEST — CODEX

> Zadání jsem přečetl. Použiji postup `lean-build`, protože jde o novou funkční stránku s více částmi a je důležité držet přesný rozsah. Nejdřív založím povinný průběžný AI log, ověřím pět ETF z primárních zdrojů, pak připravím reklamy, stránku, formulář, měření a dokumentaci. Nakonec provedu build a kontrolu hlavní cesty.

## 2026-10-09 20:57 CEST — CODEX (dotaz)

> Pro nastavení ostrého formuláře a informací o soukromí prosím pošlete Formspree endpoint (`https://formspree.io/f/...`), název a kontakt provozovatele a informaci o době uchování kontaktu. Pokud je zatím nemáte, napište „zatím nemám“; dokončím ostatní části s jasně označenými místy k doplnění.

## 2026-10-09 20:58 CEST — CODEX (pracovní postup)

- Přečten `instructions.txt`, výchozí Vite/React projekt a `lean-build`.
- Git remote: `https://github.com/Elfkam/clientelo.git`; pracovní strom měl pouze nepřidaný `instructions.txt`.
- Původní sandbox pro shell selhal kvůli mountu `/mnt/wslg/distro`; čtení se podařilo přes povolenou eskalaci.

## 2026-10-09 20:59 CEST — UŽIVATEL (odpověď na dotaz)

> zatím nemám

## 2026-10-09 20:59 CEST — CODEX

> Pět fondů mám podložených aktuálními factsheety Vanguard k 30. 6. 2026: VOO, VUG, VTV, VB a VIG; všechny factsheety uvádějí kotaci na NYSE Arca. Ve veřejném adresáři NYSE se jednotlivé záznamy načítají skriptem a čtecí nástroj jejich obsah nezískal. Do dokumentace proto přesně zapíšu, co se podařilo ověřit přímo u NYSE a co dokládá emitent, bez tvrzení o dokončeném nezávislém ověření aktuálních názvů v adresáři. Odpověď „zatím nemám“ znamená, že formulář a stránka poběží jako připravená ukázka, ale skutečné podání kontaktu zůstane vypnuté do dodání endpointu a údajů provozovatele.

## 2026-10-09 21:02 CEST — CODEX

> První build prošel. Lint našel jednu chybu proti pravidlům Reactu: aktualizaci `ref` během renderování v hooku měření. Přesunu ji do efektu a kontrolu zopakuji. Formulář bez dodaného endpointu výslovně ukazuje, že není aktivní; úspěch se zobrazí až po kladné odpovědi skutečného API.

## 2026-10-09 21:04 CEST — CODEX

> Dokumentace a obě reklamy jsou připravené. Lint i produkční build nyní procházejí; Vite při buildu pouze upozorňuje, že zdejší Node.js 20.18.1 je pod jeho deklarovaným minimem 20.19. Zbývá vizuální kontrola mobilu a klávesnice, doplnění průběžného logu a ověření, zda mám skutečný přístup k publikaci repozitáře a hostingu.

## 2026-10-09 21:05 CEST — CODEX (práce a ověření)

+- Implementováno pět ETF, dvě české reklamy, responzivní stránka, srovnání, Formspree hook, lokální analytický adaptér a README.
+- Primární dokumenty Vanguard: F0968, F0967, F0966, F0969 a F0920; stav údajů 30. 6. 2026. NYSE adresář je dostupný, ale záznamy jsou pro textový nástroj skryté za JavaScriptem. Oficiální NYSE oznámení z roku 2008 potvrzuje čtyři tickery na NYSE Arca; oficiální stránka NYSE z roku 2026 potvrzuje VOO.
+- `npm run build` prošel, upozornil na Node.js 20.18.1 pod deklarovaným minimem Vite. První `npm run lint` našel zápis do `ref` během renderu; po opravě prošel.
+- Headless Chrome pořídil snímky pro 390 × 844 px a 1365 × 900 px; úvodní obrazovka je čitelná a CTA je vidět. Test interakcí ještě následuje.
