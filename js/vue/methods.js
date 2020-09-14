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