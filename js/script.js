class Player {
    constructor(name) {
        this.name;
        this.color;
        this.position = 0;
        this.luck = 1;
        if(name != undefined)
            this.name = name;
        this.changeLuck =  function changeLuck(change) {
            this.luck += change;    
            if (this.luck < 0.5)
                this.luck = 0.5;
            else if(this.luck > 2)
                this.luck = 2;
            this.luck = Math.round((this.luck)*10)/10;
        }
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


if (!(window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || window.navigator.standalone == true)){ //no web app
    if (document.addEventListener){//return to fullscreen
        document.addEventListener('fullscreenchange', exitHandler, false);
        document.addEventListener('mozfullscreenchange', exitHandler, false);
        document.addEventListener('MSFullscreenChange', exitHandler, false);
        document.addEventListener('webkitfullscreenchange', exitHandler, false);
    }function exitHandler(){
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement){
            app.overlayWarnings.push({
                text: app.text.continueGame,
                yes: function() {
                        app.overlayWarnings.splice(0, 1);
                        app.requestFullscreen();
                    },
                no: function() {
                        app.overlayWarnings.splice(0, 1);
                        app.exitGame();
                    }
            });
        }
    }

    //disable for debugging
    app.overlayWarnings.push(
        {
            text: this.text.startGame,
            yes: function() {
                    app.overlayWarnings.splice(0, 1);
                    app.requestFullscreen();
                },
            no: function() {
                    app.overlayWarnings.splice(0, 1);
                    app.exitGame();
                }
        }
    );
}

//service worker
if ("serviceWorker" in navigator){
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("serviceWorker.js")
    });
    const swListener = new BroadcastChannel("swListener");
    swListener.onmessage = function(e) {
        if(e.data == "update") //alert on update
            app.slideUpInfos.push({
                text: app.text.update,
                yes: function() {
                            app.slideUpInfos.splice(0, 1);
                            location.reload();
                    },
                no: function() {
                        app.slideUpInfos.splice(0, 1);
                    }
            });
    };
}

//install
//window.addEventListener('beforeinstallprompt', console.log("install prompt"));
