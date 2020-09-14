var app = new Vue({
    el: "#app",
    data: {
        show: {
            turnWarningOuter: true,
            alcoholWarningOuter: true
        },
        text: {
            title: "Spiel",
            player: "Spieler",
            manual: "Drehe das Handy ins Querformat, um das Spiel zu starten.\n"+
                    "Drehe es zurück, um Spieler zu bearbeiten oder hinzuzufügen.",
            alcoholWarning: "Alkohol ist schädlich. "+
                            "Mit dem Fortfahren bestätigt ihr für alle eventuellen Konsequenzen selbst verantwortlich zu sein. "+
                            "Und so weiter...",
            back: "Zurück",
            ok: "OK",
            overlayWarning: "Bitte drehe das Gerät hochkant, um das Spiel zu starten.",
            continueGame: "Weiterspielen?",
            rollDice: "Würfeln",
            nextPlayer: "Zug beenden",
            pleaseAddPlayers: "Bitte Spieler hinzufügen"
        },
        playerList: [{name:"Player1",position:0},{name:"Player2",position:0},{name:"Player3",position:0}],
        game: {
            playerColors: ["white","yellow","orange","pink","tomato","red","green","darkgreen","turquoise","cyan","steelblue","slateblue","purple","chocolate","gold"],
            buttons: []
        }
    },
    mounted() {
        if (localStorage.getItem("playerList")) {
            try {
                this.playerList = JSON.parse(localStorage.getItem('playerList'));
            } catch(e) {
                console.error(e);
                localStorage.removeItem('playerList');
            }
      }
    },
    methods: {
        addPlayersListItem: function() {
            this.playerList.push(new Player);
            setTimeout(()=>{//wait until input is created
                document.getElementById("addPlayersList").lastElementChild
                    .scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                    });
            },50);
        },
        deletePlayersListItem: function(index) {
            var freeColor = this.playerList.splice(index, 1)[0].color; //remove player
            this.game.playerColors.push(freeColor);
        },
        nextPlayersListItem: function() {
            if (document.activeElement.parentElement.nextElementSibling == null)
                this.addPlayersListItem();
                setTimeout(()=>{//wait until input is created
                    document.activeElement.parentElement.nextElementSibling.firstElementChild.focus();
                },100);
        },
        startGame: function() {
            this.show.alcoholWarningOuter = false;
            this.show.turnWarningOuter = false;
            this.requestFullscreen();
        },
        exitGame: function() {
            window.history.back();
        },
        saveGame: function(){
            localStorage.setItem('playerList', JSON.stringify(this.playerList));
        },
        requestFullscreen: function() {
            var element = document.body;
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
            requestMethod.call(element);
        },
        rollDice: function() {
            this.players[0].position += Math.ceil(Math.random()*2);
            if (this.players[0].position > 100)
                this.players[0].position = 100;
            document.getElementById("gameField"+this.players[0].position).scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
            app.game.buttons = [{action: app.nextPlayer, text: app.text.nextPlayer}];
        },
        nextPlayer: function() {
            this.players.push(
                this.players.splice(0,1)[0] //next player
            );
            document.getElementById("gameField"+this.players[0].position).scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center'
                    });
            app.game.buttons = [{action: app.rollDice, text: app.text.rollDice}];
        },
        currentPlayerColor: function() {
            if (this.players.length>0)
                return this.players[0].color;
            else
                return '#ccc';
        },
        currentPlayerName: function() {
            if (this.players.length>0)
                return this.players[0].name;
            else
                return this.text.pleaseAddPlayers;
        }
    },
    computed: {
        players: function() {
            var players = this.playerList.filter(p => p.name!=undefined && p.name!="");
            players.forEach(p => {
                if (p.name == "Oliver" || p.name == "Olli" || p.name == "oliver" || p.name == "olli" || p.name == "0lli" || p.name == "0liver") //me :)
                    p.color = "lime";
                else if (p.color == undefined){
                    if (this.game.playerColors.length > 0)
                        p.color = this.game.playerColors.splice(
                            Math.floor(Math.random() * this.game.playerColors.length),1)[0];
                    else
                        p.color = "#"+(Math.random()*0xBBBBBB+0x444444<<0).toString(16); //random color >= #444
                }
            });
            return players;
        }
    },
    watch: {
    },
    components: {
        addPlayersListItem: {
            props: ["player-text","player-list","player","index"],
            computed: {
                backgroundColor: function() {
                    var player = this.playerList[this.index];
                    if (player != undefined && player.color != undefined)
                        return "background-color: " + player.color;
                    return "";
                }
            },
            template: `<div>
                            <input
                                :placeholder="playerText + ' ' + (index+1)"
                                v-model="playerList[index].name"
                                type="text"
                                class="addPlayersListItem"
                                @keydown.enter="$emit('next-players-list-item')">
                            <img
                                @click="$emit('delete-players-list-item',index)"
                                src="img/plus.svg"
                                alt="x"
                                :style="backgroundColor"
                                class="removePlayersListButton">
                        </div>`
        },
        gameField: {
            props: ["number", "players-array"],
            computed: {
                content: function() {
                    return this.number==0 ? "Start" : this.number;
                },
                players: function() {
                    return this.playersArray.filter(
                        function filterPosition(element) {
                            return element.position == this;}, 
                        this.number).slice().reverse();
                }
            },
            template: `<div class="gameField">
                            <div class="gameFieldText">{{ content }}</div>
                            <div class="playerContainer">
                                <div
                                    v-for="(player, index) in players"
                                    :key="index"
                                    :style="'background-color:'+players[index].color"
                                    class="player">
                                </div>
                            </div>
                        </div>`
        }
    }
});

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