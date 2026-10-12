# GD Lab — Geometrie descriptivă și desen tehnic

Aplicație educațională integrată pentru cele zece unități ale cursului: 345 de carduri cu repetiție spațiată, 38 de exerciții de seminar, 14 ilustrații de control, 50 de întrebări de examen și 23 de activități de construcție.

Atelierul adaugă geometrie 3D reală, cameră cu orbită și zoom, plane H/V/W, proiectante, rotația planelor până la epura comună, rabateri, rotații, schimbare de plan și desfășurări. Studentul construiește puncte, drepte, paralele, perpendiculare, intersecții, cercuri și arce. Verificarea analitică explică erorile în coordonate metrice și verifică corespondența H–V–W.

## Utilizare

1. Deschide Laborator și alege unitatea, apoi activitatea.
2. Explorează modelul 3D și citește datele geometriei.
3. Alege eticheta punctului și plasează-l în planșă. Alternativ, deschide plasarea prin coordonate.
4. Selectează instrumentul și punctele necesare pentru a construi liniile sau arcele.
5. Verifică rezultatul. Soluția este opțională; o construcție realizată după consultarea ei nu este înregistrată ca rezolvare fără ajutor.

Coordonatele spațiale sunt în metri; dimensiunile pe hârtie sunt în milimetri; unghiurile afișate sunt în grade. OX pozitiv este spre stânga. Planșa SVG exportată este pentru studiu și păstrează etichetele grilei; dimensiunea sa fizică de imprimare nu stabilește automat o scară metrică.

## Pornire și verificare

Necesită Node.js 22 sau mai nou pentru instrumentele de dezvoltare:

```sh
npm ci
npm test
npx playwright install chromium
npm run test:browser
npm run build
npm start
```

Deschide http://127.0.0.1:4173/gd-lab/. Pe Linux, instalarea browserului pentru CI folosește `npx playwright install --with-deps chromium`.

## Publicare prin GitHub Pages

Fluxul din [.github/workflows/pages.yml](.github/workflows/pages.yml) verifică matematica, integritatea datelor, interfața, randarea și funcționarea offline înainte de publicare. Publică exclusiv directorul generat `dist/`.

Adresa aplicației este **[https://acsbalan.github.io/gd-lab/](https://acsbalan.github.io/gd-lab/)**. Starea fiecărei publicări poate fi verificată în [GitHub Actions](https://github.com/ACSBalan/gd-lab/actions).

Sursa Pages este deja configurată ca **GitHub Actions**. Modificările ulterioare pe `main` trec prin același flux de teste și publicare.

## Salvare, transfer și instalare

Progresul și construcțiile sunt salvate pe dispozitiv, fără cont. Cheia existentă `gd-lab-student-state` și toate identificatoarele cardurilor sunt păstrate. Sunt acceptate și exporturile GD Carduri. Din Setări se exportă/importă copia JSON, inclusiv construcții și rezultate.

Varianta web este recomandată atât pe laptop/desktop, cât și pe iPhone și Android. Primește actualizările și permite lucrul offline după prima încărcare completă, când apare „Offline pregătit”. Dacă apare „Versiune nouă disponibilă”, apasă „Reîncarcă aplicația”; progresul se păstrează.

Fișierul GD_Lab.html este copia portabilă a aceleiași aplicații, cu datele, imaginile și modulele 3D încorporate. Se deschide direct într-un browser modern, fără server și fără conexiune, și este mai comod de folosit pe laptop. Nu primește automat actualizări: pentru acestea trebuie descărcat fișierul nou.

Progresul este separat între site și fișierul local, între browsere și între dispozitive. Pentru transfer, folosește Setări → Exportă progresul în varianta în care ai lucrat, apoi Setări → Importă progresul în cealaltă. Nu există sincronizare automată.

Pe iPhone: deschide adresa în Safari → Partajare → Adaugă la ecranul principal. Pe Android: deschide adresa în Chrome și folosește opțiunea de instalare sau adăugare la ecranul principal din meniul browserului. Așteaptă „Offline pregătit” după prima încărcare. Utilizatorul a confirmat anterior funcționarea pe iPhone și Android; această livrare nu include o nouă verificare pe telefoane fizice. Randarea 3D necesită WebGL; restul aplicației oferă acces la planșă și materialele de studiu dacă acesta nu este disponibil.

## Documentație și proveniență

- [Corecturi și verificări pentru auditul din 12 octombrie 2026](docs/audit-2026-10-12.md)
- [Raport de validare](docs/validation.md)
- [Arhitectură, formule și persistență](docs/architecture.md)
- [Acoperirea celor zece unități](docs/curriculum.md)

Baza este arhiva PWA furnizată. Resursele neafectate și datele corectate intenționat au verificări SHA-256; identificatoarele sunt comparate separat cu versiunea inițială, iar calculele laboratoarelor de referință au teste de regresie numerică. Registrul auditului precizează modificările. GD_Lab.html este generat din aceleași date și module ca aplicația integrată. Include cele 23 de activități, Three.js și toate imaginile; rulează local fără cereri de rețea. Se regenerează cu npm run standalone. Pentru instalarea PWA se folosește build-ul din dist, publicat prin HTTPS. Fișierul CONTROL_CALITATE.txt este documentul de control primit cu arhiva, nu raportul acestei implementări. Nu sunt publicate PDF-urile sursă.

Convențiile urmează N. D. Sârbu (2017), suportul academic extins și caietul de seminar furnizat. Three.js este distribuit local, cu licența MIT în vendor/LICENSE. Aplicația nu folosește un CDN la rulare.


## Materiale armonizate

Aplicația web și GD_Lab.html conțin aceleași corecturi ale auditului academic final. Cele 345 de ID-uri sunt păstrate. Cursul are 122 de pagini, iar caietul 67, deci paginația documentelor finale nu a fost decalată. [Registrul corecturilor și verificărilor](docs/materiale-armonizate.md) descrie această actualizare. PDF-urile sunt materiale separate; aplicația folosește datele incluse în repository și nu le citește la rulare.
