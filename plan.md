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
            }
        }
    }
    ```

## Milestones

- [ ] Kunne tegne og lagre til databasen koblet til playerID
- [ ] Vise den det lagret bilde til en annen person og vise forskjellige bilder for brukere
