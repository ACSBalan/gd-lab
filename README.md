# GD Lab — Geometrie descriptivă și desen tehnic

Aplicație educațională pentru studenți: 345 de carduri, laboratoare geometrice pentru toate cele 10 unități, 38 de fișe de seminar, 14 planșe de autocontrol, 50 de întrebări de examen și salvarea progresului.

## Publicare pe GitHub Pages

1. Încarcă **conținutul acestui folder** în rădăcina unui repository GitHub (public sau cu Pages disponibil).
2. În repository, deschide **Settings → Pages**, alege **Deploy from a branch**, ramura `main`, folderul `/ (root)` și salvează.
3. Deschide adresa Pages de pe iPhone în **Safari**, alege **Partajare → Adaugă la ecranul principal**.
4. Deschide aplicația măcar o dată cu internet, apoi o poți folosi offline. Salvarea este locală pe dispozitiv.

## Date și confidențialitate

Aplicația funcționează fără cont. Cardurile și modelele sunt încărcate din fișiere locale. Progresul, notițele de seminar și rezultatele testelor sunt în `localStorage`, nu sunt încărcate pe server. Pentru transfer sau copie de siguranță: **Setări → Exportă progresul** și apoi **Importă progresul** pe alt dispozitiv. Sunt acceptate exporturile GD Carduri.

## Utilizare

- **Acasă:** alege oricare dintre cele 10 teme sau un mod de învățare.
- **Carduri:** reamintește-ți răspunsul, întoarce cardul, apreciază dificultatea; poți exersa liber fără modificarea programării.
- **Laborator:** modifică parametri, compară 3D cu 2D, răspunde la verificări matematice; pentru punct poți construi și epura cu două proiecții.
- **Seminar:** rezolvă problemele din caiet; vezi soluțiile și planșele numai după ce le ceri.
- **Examen:** întrebări cu patru variante distincte, una corectă, cu feedback imediat, egal repartizate pe unități.
- **Progres:** urmărește separat memorarea și problemele practice.

## Verificări

Scripturile de verificare sunt în folderul `tests`. Acestea confirmă integritatea datelor și formulele/pozițiile modelelor selectate. Ele nu certifică exhaustiv fiecare planșă din materialele academice și nu înlocuiesc verificarea pe dispozitivul real. Nu se utilizează imagini generative pentru epure.

## Controlul modelelor geometrice

Toate coordonatele spațiale sunt în metri. Grilele din laboratoare indică scara în metri, iar în secțiunea de desen tehnic valorile de pe hârtie se exprimă în milimetri. Modelul 3D este o proiecție axonometrică pentru orientare, nu o perspectivă metrică de măsurat direct. Pentru modulul de repetiție sunt păstrate toate cele 345 de ID-uri de card. Fișierul HTML autonom are aceleași modele și aceleași date ca arhiva pentru GitHub Pages.

Funcționarea offline este implementată cu Service Worker, dar instalarea și folosirea pe un iPhone fizic trebuie confirmate pe dispozitiv. La actualizarea pe același domeniu, noul Service Worker folosește un cache distinct; progresul local nu este șters.
