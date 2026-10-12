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

În repository: **Settings → Pages → Source: GitHub Actions**. Această configurare se face o singură dată. Adresa proiectului este **https://acsbalan.github.io/gd-lab/** (fără spațiul din numele contului). Starea efectivă a publicării se verifică în Actions și Pages; existența configurației nu dovedește singură că adresa este deja activă.

## Salvare, transfer și instalare

Progresul și construcțiile sunt salvate pe dispozitiv, fără cont. Cheia existentă `gd-lab-student-state` și toate identificatoarele cardurilor sunt păstrate. Sunt acceptate și exporturile GD Carduri. Din Setări se exportă/importă copia JSON, inclusiv construcții și rezultate.

Pentru mutarea de la fișierul HTML la adresa web: exportă progresul în aplicația veche și importă-l pe noua adresă. Browserul nu permite transfer automat între origini diferite.

Pe iPhone: deschide adresa în Safari → Partajare → Adaugă la ecranul principal. Așteaptă „Offline pregătit” după prima încărcare. Instalarea și pornirea offline pe un iPhone fizic trebuie confirmate pe dispozitiv. Randarea 3D necesită WebGL; restul aplicației oferă acces la planșă și materialele de studiu dacă acesta nu este disponibil.

## Documentație și proveniență

- [Raport de validare](docs/validation.md)
- [Arhitectură, formule și persistență](docs/architecture.md)
- [Acoperirea celor zece unități](docs/curriculum.md)

Baza este arhiva PWA furnizată. Datele, SRS, geometria de referință și ilustrațiile originale sunt verificate prin hash SHA-256. Fișierul HTML autonom încărcat inițial rămâne în repository ca referință; nu este inclus în aplicația publicată. Fișierul CONTROL_CALITATE.txt este documentul de control primit cu arhiva, nu raportul acestei implementări. Nu sunt publicate PDF-urile sursă.

Convențiile urmează N. D. Sârbu (2017), suportul academic extins și caietul de seminar furnizat. Three.js este distribuit local, cu licența MIT în vendor/LICENSE. Aplicația nu folosește un CDN la rulare.
