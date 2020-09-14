var game = {
    rollDice: async function() {
        document.getElementById("dice").style.display = "inline";
        app.players[0].position += await game.rollDiceAnimation();
        if (app.players[0].position > 100)
        app.players[0].position = 100;
        document.getElementById("gameField"+app.players[0].position).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
        app.game.text = game.field[app.players[0].position].action();
    },
    rollDiceAnimation: async function(time){
        if(isNaN(time))
            time = 2;
        var number = Math.ceil(Math.random()*6);
        document.getElementById("dice").src = dice[number];
        time += 2;
        if(time>30)
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(number);
                }, Math.log(time)*50);
            });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(game.rollDiceAnimation(time));
            }, Math.log(time)*50);
          });
    },
    nextPlayer: function() {
        document.getElementById("dice").style.display = "none";
        app.players.push(
            app.players.splice(0,1)[0] //next player
        );
        document.getElementById("gameField"+app.players[0].position).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
        //app.saveGame();
        app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
        app.game.text = app.text.pressRollDice;
    },
    field: [
        {
            action: function() {
                return 1;
            },
            color: "#ae0000"
        },
        {
            action: function() {
                return 2;
            }
        },
        {
            action: function() {
                return 3;
            }
        },
        {
            action: function() {
                return 4;
            }
        },
        {
            action: function() {
                return 5;
            }
        },
        {
            action: function() {
                return 6;
            }
        },
        {
            action: function() {
                return 7;
            }
        },
        {
            action: function() {
                return 8;
            }
        },
        {
            action: function() {
                return 9;
            }
        },
        {
            action: function() {
                return 10;
            }
        },
    ]
}