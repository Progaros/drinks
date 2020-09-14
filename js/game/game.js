var game = {
    rollDice: async function() {
        document.getElementById("dice").style.display = "inline";
        app.game.buttons = [{action: ()=>{}, text: app.text.rollDice}];
        var position = app.players[0].position += await game.rollDiceAnimation(app.players[0].luck);
        if (position > (game.field.length-1))
        position = app.players[0].position = game.field.length-1;
        document.getElementById("gameField"+position).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
        app.game.text = game.field[position].action();
        if (game.field[position].onlyText == undefined)
            app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
    },
    rollDiceAnimation: async function(luck, time, number){
        //setup
        if(isNaN(luck))
            luck = NaN;
        if(isNaN(time))
            time = 2;
        if(isNaN(number))
            number = 1;
        var tempNumber;

        do { //get new random number
            tempNumber = Math.ceil( 6*Math.pow((Math.random()),1/luck));
        } while (tempNumber == number)
        number = tempNumber;

        document.getElementById("dice").src = dice[number]; //set dice face

        time ++;
        if(time>10) // break condition
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(number);
                }, 200);
            });
        return new Promise((resolve) => { // roll again slower
            setTimeout(() => {
                resolve(game.rollDiceAnimation(luck, time, number));
            }, Math.log(time*3)*50);
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
        app.saveGame();
        app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
        app.game.text = app.text.pressRollDice;
    },
    field: [{},
        {
            action: function() {
                app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
                return "Nochmal Würfeln";
            },
            onlyText: false
            //,color: "#ae0000"
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
                confetti.start();
                app.resetSave();
                app.game.buttons = [{action: app.resetGame, text: "Nochmal"}];
                return "Glückwunsch "+app.players[0].name+",\ndu hast gewonnen!🎉";
            },
            onlyText: false,
            color: "#b68f0e"
        },
    ]
}