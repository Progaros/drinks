class Player {
    constructor(name) {
        this.name;
        this.color;
        this.position = 0;
        this.luck = 1;
        if(name != undefined)
            this.name = name;
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
document.title = app.text.browserTitle;
if (app.playerList.length == 0)
    for(let i=0;i<3;i++) //add players to addPlayerList
        app.playerList.push(new Player());//new Player

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
        app.show.turnWarning = true;
    }
}
        
//app.show.alcoholWarning = false; app.show.turnWarning = false;  //enable for debugging // TODO disable

//service worker
if ("serviceWorker" in navigator){
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("serviceWorker.js")
    });
    const swListener = new BroadcastChannel("swListener");
    swListener.onmessage = function(e) {
        if(e.data == "update") //alert on update
            app.slideUpInfoYes = function() {
                app.show.slideUpInfo = false;
                location.reload();
            }
            app.slideUpInfoNo = function() {
                app.show.slideUpInfo = false;
            }
            app.text.slideUpInfo = app.text.update;
            app.show.slideUpInfo = true;
    };
}