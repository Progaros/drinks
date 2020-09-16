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
        localStorage.removeItem('playerList');
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
    currentPlayerDisplay: function() {
        if (this.players.length > 1)
            return "block";
        else
            return "table";
    },
    currentPlayerName: function() {
        if (this.players.length > 1)
            return this.players[0].name;
        else
            return this.text.pleaseAddPlayers;
    },
    scrollToPlayer: function() {
        document.getElementById("gameField"+app.players[0].position)
        .scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    },
    slideUpInfoYes: function() {
    },
    slideUpInfoNo: function() {
    }
}