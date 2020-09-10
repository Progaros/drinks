Vue.component("game-field", {
    props: ['number'],
    template: "<div class='gameField'>{{ number }}</div>"
});

var app = new Vue({
    el: "#app",
    data: {
        show: {
            turnWarningOuter: true,
            alcoholWarningOuter: true
        },
        text: {
            title: "Trinkspiel",
            player: "Spieler",
            manual: "Drehe das Handy ins Querformat, um das Spiel zu starten.\n"+
                    "Drehe es zurück, um Spieler zu bearbeiten oder hinzuzufügen.",
            alcoholWarning: "Alkohol ist schädlich. "+
                            "Mit dem Fortfahren bestätigt ihr für alle eventuellen Konsequenzen selbst verantwortlich zu sein. "+
                            "Und so weiter...",
            back: "Zurück",
            ok: "OK",
            overlayWarning: "Bitte drehe das Gerät hochkant, um das Spiel zu starten.",
            continueGame: "Weiterspielen?"
        },
        playerList: []
    },
    methods: {
        addPlayerListItem: function() {
            app.playerList.push(new Player);
        },
        deletePlayerListItem: function(index) {
            this.playerList.splice(index, 1);
        },
        nextPlayersListItem: function() {
            if (document.activeElement.parentElement.nextElementSibling == null)
                app.addPlayerListItem();
                setTimeout(()=>{//wait until input is created
                    document.activeElement.parentElement.nextElementSibling.firstElementChild.focus();
                },50);
        },
        startGame: function() {
            app.show.alcoholWarningOuter = false;
            app.show.turnWarningOuter = false;
            app.requestFullscreen();
        },
        exitGame: function() {
            window.history.back();
        },
        requestFullscreen: function() {
            var element = document.body;
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
            requestMethod.call(element);
        }
    },
    computed: {
        players: function() {
            var players = this.playerList.filter(x => x.name != undefined);
            if (players.length == 0)
                return [{ name: "Bitte füge Spieler hinzu" }]; //default message
            else
                return players;
        }
    }
});

class Player {
    constructor() {
        this.name;
        this.position = 0;
    }
};

//setup
document.title = app.text.title;
for(let i=0;i<3;i++) //add players to addPlayerList
    app.playerList.push(new Player);

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