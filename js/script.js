var gameField = Vue.component("game-field", {
    props: ["number", "players-array"],
    computed: {
        content: function () {
            return this.number==0 ? "Start" : this.number;
        },
        players: function () {
            return this.playersArray.filter(
                function filterPosition(element) {
                    return element.position == this;}, 
                this.number);
        }
    },
    template: `<div class="gameField">
                    <div class="gameFieldText">{{ content }}</div>
                    <div class="playerContainer">
                        <div
                            v-for="(player, index) in players"
                            :key="index"
                            class="player">
                        </div>
                    </div>
                </div>`
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
        playerList: [{name:"tset",position:0}]
    },
    methods: {
        addPlayerListItem: function() {
            app.playerList.push(new Player);
            setTimeout(()=>{//wait until input is created
                document.getElementById("addPlayersList").lastElementChild
                    .scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                    });
            },20);
        },
        deletePlayerListItem: function(index) {
            this.playerList.splice(index, 1);
        },
        nextPlayersListItem: function() {
            if (document.activeElement.parentElement.nextElementSibling == null)
                app.addPlayerListItem();
                setTimeout(()=>{//wait until input is created
                    document.activeElement.parentElement.nextElementSibling.firstElementChild.focus();
                },100);
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
        },
        rollDice: function() {
            this.players[0].position += Math.ceil(Math.random()*6);
            if (this.players[0].position > 100)
                this.players[0].position = 100;
            document.getElementById("gameField"+this.players[0].position).scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
        }
    },
    computed: {
        players: function() {
            var players = this.playerList.filter(x => x.name != undefined);
            // if (players.length == 0)
            //     return [{ name: "Bitte füge Spieler hinzu" }]; //default message
            // else
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