var methods = {
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
        this.show.alcoholWarning = false;
        this.show.turnWarning = false;
        this.requestFullscreen();
    },
    exitGame: function() {
        window.history.back();
    },
    saveGame: function(){
        localStorage.setItem('playerList', JSON.stringify(this.playerList));
        localStorage.setItem('lastTime', JSON.stringify(Date.now()));
    },
    resetSave: function(){
        var resetedPlayers = JSON.parse(JSON.stringify(app.players));
        resetedPlayers.forEach(p => {p.position=0; p.luck=1});
        localStorage.setItem('playerList', JSON.stringify(resetedPlayers));
    },
    resetGame: function(){
        confetti.stop();
        app.players.push(
            app.players.splice(0,1)[0] //next player
        );
        app.players.forEach(p => {p.position=0; p.luck=1});
        app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
        app.game.text = "Drücke auf Würfeln";
        document.getElementById("gameField0")
            .scrollIntoView({
                behavior: 'smooth',
                block: 'end',
        });
    },
    notRestoreGame: function() {
        this.show.restoreProgress = false;
        localStorage.removeItem('playerList');
    },
    restoreGame: function() {
        this.show.restoreProgress = false;
        if (localStorage.getItem("playerList")) {
            try {
                this.playerList = JSON.parse(localStorage.getItem('playerList'));
            } catch(e) {
                alert("an error occured");
                console.error(e);
                localStorage.removeItem('playerList');
            }
        }
    },
    requestFullscreen: function() {
        var element = document.body;
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
        requestMethod.call(element);
    },
    currentPlayerColor: function() {
        if (this.players.length > 1)
            return this.players[0].color;
        else
            return '#ccc';
    },
    currentPlayerName: function() {
        if (this.players.length > 1)
            return this.players[0].name;
        else
            return this.text.pleaseAddPlayers;
    }
}