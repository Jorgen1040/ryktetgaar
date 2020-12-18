# Ryktet Går skisse/plan

## Tidslinje for spillet (for forståelse)

Første tegning -> Sendes til annen person som gjetter hva de ser ved å skrive inn i tekstboks -> Neste person får tekst prompten og begynner å tegne -> osv. -> Fram til alle har fått sin egen tegning tilbake

## Selve nettsiden

- [ ] Nytt spill
  - [ ] Lage en game ID, send til database

## Database

MongoDB? Eller bare en json fil

- [ ] Må finne ut av struktur kanskje noe sånt?

    ```json
    {
        "gameID": {
            "originalDrawings": {
                "playerID": "base64",
                "playerID2": "base64"
            },
            "currentDrawings": {
                "playerID": "base64-encoded image"
            },
            "drawingOrder": {
                "playerID": [ "originalWord", "originalDrawing", "guess1", "drawing1", "guess2", "drawing2", "guess3", "drawing3", "guess4", "drawing4" ]
            }
        }
    }
    ```

## Milestones

- [ ] UI, brukergrensesnitt
  - Se <https://www.figma.com/proto/zLzAz0sBDsL0jjKv93L4bG/Ryktet-G%C3%A5r-sketch?node-id=1%3A3&scaling=min-zoom>
  - [ ] Gi ord
  - [ ] Tegne
  - [ ] Skrive (gjette tegningen)
- [ ] Kunne tegne og lagre til databasen koblet til playerID
- [ ] Vise den det lagret bilde til en annen person og vise forskjellige bilder for brukere (bruk cookies)
- [ ] Socket.io (websocket for å oppdatere nettsiden for brukere)
