# Features
- PC and Mobile
- Event fields
- Optional good/bad luck fields (player can choose to use them)
- Luck variable, bonus/punishment fields
- save game in cookies
- loading screen?
- if on desktop show qrcode for phone
- write deploy script?
- cocktail glass as icon
- newest player on top
- fit text always in task box
- save on Zug beenden


# Notes
- flexbox for actual game? (https://www.w3schools.com/css/css3_flexbox.asp)
- ENABLE fullscreen button

# Review
- deletePlayerListItemButton neccesary?
- alcohol warning text
- manual text (+icons?)


app.players[0].position += Math.ceil(Math.random()*6);
document.getElementById("gameField"+app.players[0].position).scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });