class Player {
    constructor() {
        this.name;
        this.position = 0;
        this.color;
    }
};

//setup
document.title = app.text.title;
if (app.playerList.length == 0)
    for(let i=0;i<3;i++) //add players to addPlayerList
        app.playerList.push(new Player);
        app.game.buttons = [{action: app.rollDice, text: app.text.rollDice}];

//return to fullscreen
if (document.addEventListener){ // TODO: if webapp ignore and go (stay?) fullscreen
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
}function exitHandler(){
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement){
        app.text.alcoholWarning = app.text.continueGame;
        app.show.alcoholWarningOuter = true;
    }
}
        
app.show.alcoholWarningOuter = false; app.show.turnWarningOuter = false;  //enable for debugging