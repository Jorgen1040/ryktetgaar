# Ryktet Går skisse/plan

## Tidslinje for spillet (for forståelse)

Første tegning -> Sendes til annen person som gjetter hva de ser ved å skrive inn i tekstboks -> Neste person får tekst prompten og begynner å tegne -> osv. -> Fram til alle har fått sin egen tegning tilbake

## Selve nettsiden

- [x] Nytt spill
  - [x] Lage en game ID, send til database

## Database

~~MongoDB? Eller bare en json fil~~

Bruk classes og module.export til å lagre data, siden det uansett vil være midlertidig, og vil gjøre det lettere å hente/ vise til bruker.

## Milestones

- [x] UI, brukergrensesnitt
  - Se <https://www.figma.com/proto/zLzAz0sBDsL0jjKv93L4bG/Ryktet-G%C3%A5r-sketch?node-id=1%3A3&scaling=min-zoom>
  - [x] Gi ord
  - [x] Tegne
  - [x] Skrive (gjette tegningen)
  - [x] Vise sider til brukeren via socket.io, brukeren har JS som endrer siden (for når man er i spillet)
- [x] Kunne tegne og lagre til databasen koblet til playerID
- [x] Vise den det lagret bilde til en annen person og vise forskjellige bilder for brukere
- [x] Socket.io (websocket for å oppdatere nettsiden for brukere)
