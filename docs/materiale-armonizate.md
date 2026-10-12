# Armonizarea cu materialele finale

Actualizarea din 12 octombrie 2026 aduce în aplicația web aceleași corecturi deja incluse în GD_Lab.html livrat separat.

## Conținut corectat

- Răspunsuri: GD-U02-028, GD-U02-031, GD-U02-035, GD-U04-035, GD-U04-036, GD-U06-022, GD-U08-005, GD-U09-009, GD-U09-017 și GD-U09-020.
- Trimitere bibliografică: GD-U09-013, curs extins, p. PDF 95–96.
- Întrebare de examen: GD-Q-08-05 precizează axa cilindrului paralelă cu OZ și secțiunea eliptică completă.

Corecturile explicitează cazurile pe OX și bisectoare, urmele finite distincte, deosebirea dintre proiecția pe V și componenta OZ, secțiunea completă a cilindrului, excepția frontalelor la desfășurare și folosirea radianilor în formule. Regula de cotare și reperul ±0,00 corectate anterior sunt păstrate.

Toate cele 345 de identificatoare, cheia de stocare și formatul progresului sunt păstrate. Cele 38 de exerciții, cele 14 imagini și modulele geometrice ale atelierului sunt identice versiunii publicate anterior. Datele nu depind de deschiderea sau prezența PDF-urilor.

## HTML portabil

GD_Lab.html este generat din sursele aplicației prin `npm run standalone`. Include toate cele 23 de activități, modulele 3D și imaginile și poate fi deschis local fără cereri HTTP. Nu înregistrează service worker; actualizările sale se fac prin descărcarea unui nou fișier. Progresul se transferă manual între site, HTML și dispozitive prin Setări → Exportă/Importă progresul.

## Verificări efectiv executate înaintea publicării

- 29/29 teste de matematică, conținut, integritate și build.
- 12/12 teste funcționale ale aplicației web.
- 13/13 teste de regresie pentru corecturile anterioare, inclusiv atingere, axă continuă, etichete și actualizarea cache-ului cu păstrarea progresului.
- 2/2 teste HTML: deschidere offline din fișier, toate cele 23 de activități 3D, zero cereri HTTP și erori JavaScript, interfață la 360 px, import/export și persistența progresului.
- Inspecție vizuală a capturilor desktop și mobil ale HTML-ului.

Configurația locală a browserului și portul testelor au fost adaptate mediului Windows pentru aceste execuții; configurația CI folosește Chromium instalat de Playwright. Fluxul GitHub Actions execută din nou testele pe sursele publicate și publică numai după succes. Rezultatele publicării sunt în GitHub Actions, iar versiunea efectiv servită este identificată de `build-info.json`.

Instalarea pe telefoane fizice nu a fost repetată pentru această livrare; utilizatorul confirmase funcționarea pe iPhone și Android. Testele mobile folosesc o fereastră de 360 px și atingere simulată.
