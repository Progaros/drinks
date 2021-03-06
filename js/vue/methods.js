var methods = {
    addPlayersListItem: function() {
        this.playerList.push(new Player);
        setTimeout(()=>{ //wait until input is created
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
            setTimeout(()=>{ //wait until input is created
                document.activeElement.parentElement.nextElementSibling.firstElementChild.focus();
            },100);
    },
    drawCard: function(){
        if (this.currentCards.length == 0)
            this.currentCards.push(...this.stacks.find(
                    stack => stack.name == this.currentStack //selected
                ).cards);
        var randomPosition = Math.floor(Math.random()*this.currentCards.length);
        return this.currentCards.splice(randomPosition,1)[0];
    },
    startGame: function() {
        this.show.alcoholWarning = false;
        this.show.turnWarning = false;
        this.requestFullscreen();
    },
    exitGame: function() {
        if (isWebApp()){
            window.close();
        }
        else if (!isTouch())
            window.parent.document.dispatchEvent(new CustomEvent('exit'));
        else
            window.history.back();
    },
    saveGame: function(){
        localStorage.setItem('playerList', JSON.stringify(this.playerList));
        localStorage.setItem('currentStack', JSON.stringify(this.currentStack));
        localStorage.setItem('lastTime', JSON.stringify(Date.now()));
    },
    resetSave: function(){
        localStorage.removeItem('playerList');
        localStorage.removeItem('currentStack');
    },
    resetGame: function(){
        confetti.stop();
        app.players.forEach(p => {p.position=0; p.luck=1});
        app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
        app.game.text = "Drücke auf Würfeln";
        document.getElementById("gameField0")
            .scrollIntoView({
                behavior: 'smooth',
                block: 'end',
        });
    },
    resetPlayers: function(){
        app.playerList = [];
        for(let i=0;i<3;i++) //add players to addPlayerList
            app.playerList.push(new Player());//new Player
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
    scrollToPlayer: function(player) {
        if (player == undefined)
            player = 0;
        document.getElementById("gameField"+app.players[player].position)
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