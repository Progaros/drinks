var computed = {
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
        if(!this.game.started && players.length > 1){
            this.game.started = true;
            app.game.buttons = [{action: app.rollDice, text: app.text.rollDice}];
        }
        return players;
    }
}