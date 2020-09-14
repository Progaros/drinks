class Player {
    constructor(name) {
        this.name = name;
        this.color;
        this.position = 0;
        this.luck = 1;
    }
    changeLuck(change) {
        this.luck += change;
        if (this.luck < 0.5)
            this.luck = 0.5;
        else if(this.luck > 2)
            this.luck = 2;
        this.luck = Math.round((this.luck)*10)/10;
    }
};

//setup
document.title = app.text.title;
if (app.playerList.length == 0)
    for(let i=0;i<3;i++) //add players to addPlayerList
        app.playerList.push(new Player("Spieler "+(i+1)));//new Player

//preload images
var dice = []
for(let i=1;i<=6;i++) {
    var img=new Image();
    var url = "img/dice/"+i+".png";
    img.src = url;
    dice[i] = url;
}

//return to fullscreen
if (document.addEventListener){ // TODO: if webapp ignore and go (stay?) fullscreen
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
}function exitHandler(){
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement){
        app.text.alcoholWarning = app.text.continueGame;
        app.show.alcoholWarning = true;
    }
}
        
//app.show.alcoholWarning = false; app.show.turnWarning = false;  //enable for debugging