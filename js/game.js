var game = {
    rollDice: async function() {
        game.disableButtons(); //block the button while rolling
        document.getElementById("dice").style.display = "inline";
        var position = app.players[0].position += await game.rollDiceAnimation(app.players[0].luck); //roll dice
        if (position > (game.fields.length-1)) //if further than finish
            position = app.players[0].position = game.fields.length-1; //go back
        document.getElementById("gameField"+position).scrollIntoView({ //scroll to player
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
        app.game.text = game.fields[position].action();
    },
    disableButtons: function(){ //block the buttons
        app.game.buttons.forEach(button => {
            button.action = ()=>{};
        });
    },
    nextPlayerButtons: function(){
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
        if(time<=10) // break condition
            return new Promise((resolve) => { // roll again slower
                var timeout = Math.pow(time,1.5)*7;
                if (debugging)
                    timeout = 0;
                setTimeout(() => {
                    resolve(game.rollDiceAnimation(luck, time, number));
                }, timeout);
            });
        return new Promise((resolve) => { //stop here
            setTimeout(() => {
                resolve(number);
            }, 200);
        });
    },
    nextPlayer: function() {
        document.getElementById("dice").style.display = "none";
        app.players.push(
            app.players.splice(0,1)[0] //next player
        );
        //if (debugging){
            console.log("");
            console.log("%cPlayer: %c" + app.players[0].name, "color: lightgreen", "");
            console.log();
        //}
        app.scrollToPlayer();
        app.saveGame();
        app.game.text = app.text.pressRollDice;
        app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
    },
    penaltyLog: {},
    checkPenaltyLog: function(field){
        if(this.penaltyLog["field"+field] == undefined)
            this.penaltyLog["field"+field] = [];
        this.penaltyLog["field"+field].push(app.players[0].name);
        if (this.penaltyLog["field"+field].filter(x => x==app.players[0].name).length < 3)
            return true;
        return false;
    },
    fields: [{},
        {// 1
            action: function() {
                app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
                return "Du darfst nochmal würfeln";
            }
        },
        {// 2
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 3
            action: function() {
                if (Math.random() < 0.5){
                    setTimeout(() => {
                        app.players[0].position += 2;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1000);
                    return "Gehe 2 Felder vor";
                } else {
                    setTimeout(() => {
                        app.players[0].position -= 2;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1000);
                    return "Gehe 2 Felder zurück";
                }
            }
        },
        {// 4
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 5
            action: function() {
                if (Math.random() < 0.5){
                    setTimeout(() => {
                        app.players[0].position = 21;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1000);
                    return "Du gehst auf Feld 21";
                } else {
                    setTimeout(() => {
                        app.players[0].position = 12;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1000);
                    return "Du gehst auf Feld 12";
                }
            }
        },
        {// 6
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        app.players[0].changeLuck(0.3);
                        game.nextPlayerButtons();
                        app.game.text = "Gute Entscheidung ;)";
                    }, text: "Klingt gut"},
                    {action: ()=>{
                        game.nextPlayerButtons();
                        app.game.text = "Dann eben nicht";
                    },text: "Brauche ich nicht"}];
                return "Angebot: Trinke jetzt 5 und du hast für das gesamte Spiel mehr Glück beim Würfeln";
            }
        },
        {// 7
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {//8
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 9
            action: function() {
                app.game.buttons =  [
                    {action: ()=>{
                        app.players[0].position += 10;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                        app.game.text = "Deine Entscheidung...";
                    },text: "10 Felder"},
                    {action: ()=>{
                        app.players[0].changeLuck(0.3);
                        game.nextPlayerButtons();
                        app.game.text = "Deine Entscheidung...";
                    }, text: "Glück"}
                ];
                return "Wähle: Gehe jetzt 10 Felder vor oder du hast für das gesamte Spiel mehr Glück beim Würfeln";
            }
        },
        {// 10
            action: function() {
                app.players[0].changeLuck(0.2);
                game.nextPlayerButtons();
                return "Du hast jetzt etwas mehr Glück beim Würfeln";
            }
        },
        {// 11
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 12
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 13
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 14
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 15
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        game.nextPlayerButtons();
                        app.game.text = "Du trinst 3";
                    }, text: "Ich hab durst"},
                    {action: ()=>{
                        app.players[0].position -= 3;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                        app.game.text = "Du gehst 3 Felder zurück";
                    },text: "Ich will zurück"}];
                return "Trink 3 oder gehe 3 Felder zurück";
            }
        },
        {// 16
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 17
            action: function() {
                app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
                return "Du darfst nochmal würfeln";
            }
        },
        {// 18
            action: function() {
                if (game.checkPenaltyLog(18)){
                    app.game.buttons = [{action: async ()=>{
                        game.disableButtons();
                        console.log(18);
                        app.game.text = "Trinke " + await game.rollDiceAnimation(app.players[0].luck);
                        app.players[0].position = 0;
                        game.nextPlayerButtons();
                        app.scrollToPlayer();
                    },text: app.text.rollDice}];
                    return "Würfel nochmal. Trink so viel wie du Augen gewürfelt hast und gehe auf START";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 19
            action: function() {
                var bestScore = 0;
                var bestPlayer = "";
                app.players.forEach(p => {if(p.position > bestScore) bestScore=p.position});
                app.players.forEach(p => {if(p.position == bestScore) bestPlayer+=p.name+", "});
                bestPlayer = bestPlayer.substring(0, bestPlayer.length-2);
                game.nextPlayerButtons();
                return "Es trinkt die Person, die dem Ziel am nächsten ist ("+bestPlayer+")";
            }
        },
        {// 20
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 21
            action: function() {
                app.players[0].changeLuck(0.2);
                game.nextPlayerButtons();
                return "Du hast jetzt etwas mehr Glück beim Würfeln";
            }
        },
        {// 22
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 23
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 24
            action: function() {
                var random = Math.floor(Math.random()*(app.players.length-1))
                var player1 = random+1;
                var player2 = (random+1)%(app.players.length-1)+1;
                app.game.buttons =  [{action: ()=>{
                        app.players[player1].changeLuck(0.2);
                        game.nextPlayerButtons();
                        app.game.text = app.players[player1].name+" hat jetzt mehr Glück";
                    }, text: app.players[player1].name},
                    {action: ()=>{
                        app.players[player2].changeLuck(0.2);
                        game.nextPlayerButtons();
                        app.game.text = app.players[player2].name+" hat jetzt mehr Glück";
                    },text: app.players[player2].name}];
                return "Wähle wer ab jetzt mehr Glück beim Würfeln hat";
            }
        },
        {// 25
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 26
            action: function() {
                app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
                return "Du darfst nochmal würfeln und dabei einmal trinken";
            }
        },
        {// 27
            action: function() {
                if (game.checkPenaltyLog(27)){
                    setTimeout(() => {
                        app.players[0].position -= 10;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1500);
                    return "Gehe 10 Felder zurück";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 28
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        game.disableButtons();
                        app.game.text = "Trinke " + (Math.ceil(await game.rollDiceAnimation(app.players[0].luck)/2));
                        game.nextPlayerButtons();
                    },text: app.text.rollDice}];
                return "Würfel nochmal. Trinke die halbe Augenzahl";
            }
        },
        {// 29
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        game.disableButtons();
                        var result = (await game.rollDiceAnimation(app.players[0].luck))*2;
                        app.players[0].position += result;
                        app.game.text = "Du gehst "+result+" Felder nach vorne"
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    },text: app.text.rollDice}];
                return "Würfel. Du gehst die doppelte Augenzahl nach vorne";
            }
        },
        {// 30
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 31
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 32
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 33
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 34
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 35
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        game.nextPlayerButtons();
                        app.game.text = "Du trinkst 3";
                    }, text: "Ich hab durst"},
                    {action: ()=>{
                        app.players[0].position -= 6;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                        app.game.text = "Du gehst 6 Felder zurück";
                    },text: "Ich will zurück"}];
                return "Trink 3 oder gehe 6 Felder zurück";
            }
        },
        {// 36
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 37
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 38
            action: function() {
                app.game.buttons =  [{action: ()=>{
                    app.players[0].position += 3;
                    app.scrollToPlayer();
                    game.nextPlayerButtons();
                    app.game.text = "Du gehst 3 Felder vor";
                }, text: "VORWÄRTS!"},
                {action: ()=>{
                    game.nextPlayerButtons();
                    app.game.text = "Du darfst das nächste Mal Trinken überspringen";
                },text: "Ich hab Zeit..."}];
            return "Gehe jetzt 3 Felder vor oder überspringe das nächste mal Trinken";
            }
        },
        {// 39
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 40
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 41
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 42
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 43
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        game.disableButtons();
                        var result = (await game.rollDiceAnimation(app.players[0].luck));
                        if (result%2 == 0){
                            app.game.text = app.players[0].name+" trinkt"
                        }
                        else {
                            app.game.text = "Die andern trinken";
                        }
                        game.nextPlayerButtons();
                    },text: app.text.rollDice}];
                return "Würfel. Bei gerader Zahl trinkst du, bei ungerader der Rest";
            }
        },
        {// 44
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 45
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 46
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 47
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 48
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 49
            action: function() {
                if (game.checkPenaltyLog(49)){
                    setTimeout(() => {
                        app.players[0].position = 36;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1000);
                    return "Du gehst auf Feld 36";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 50
            action: function() {
                var bestScore = 0;
                var worstScore = 100;
                app.players.forEach(p => {
                    if(p.position > bestScore) bestScore = p.position;
                    if(p.position < bestScore) worstScore = p.position;
                });
                if(app.players[0].position == bestScore) {
                    app.players[0].changeLuck(-0.2);
                    game.nextPlayerButtons();
                    return "Du bist zu Schnell: Ab sofort hast du weniger Glück beim Würfeln";
                }
                else if(app.players[0].position == worstScore) {
                    app.players[0].changeLuck(0.4);
                    game.nextPlayerButtons();
                    return "Hier ist ein Boost: Ab sofort hast du mehr Glück beim Würfeln";
                }
                else {
                    if (Math.random()<0.5){
                        app.players[0].changeLuck(-0.1);
                        game.nextPlayerButtons();
                        return "Du hast jetzt etwas mehr Glück beim Würfeln";
                    } else {
                        app.players[0].changeLuck(0.2);
                        game.nextPlayerButtons();
                        return "Du hast jetzt etwas weniger Glück beim Würfeln";
                    }
                }
            }
        },
        {// 51
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 52
            action: function() {
                app.players[0].changeLuck(-0.1);
                game.nextPlayerButtons();
                return "Du hast jetzt etwas weniger Glück beim Würfeln";
            }
        },
        {// 53
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 54
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 55
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        game.disableButtons();
                        var result = await game.rollDiceAnimation(app.players[0].luck);
                        app.players[0].position -= result;
                        app.game.text = "Du gehst "+result+" Felder zurück"
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    },text: app.text.rollDice}];
                return "Würfel. Du gehst die Anzahl der Augen zurück";
            }
        },
        {// 56
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 57
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        game.disableButtons();
                        app.game.text = "Du darfst " + await game.rollDiceAnimation(app.players[0].luck) + " verteilen";
                        game.nextPlayerButtons();
                    },text: app.text.rollDice}];
                return "Würfel nochmal. Verteile die Augenzahl in Schlucken";
            }
        },
        {// 58
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 59
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        app.players[0].position += 3;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                        app.game.text = "Du gehst 3 Felder vor";
                    }, text: "VORWÄRTS!"},
                    {action: ()=>{
                        game.nextPlayerButtons();
                        app.game.text = "Du darfst das nächste Mal Trinken überspringen";
                    },text: "Ich hab Zeit..."}];
                return "Gehe jetzt 3 Felder vor oder überspringe das nächste Mal Trinken";
            }
        },
        {// 60
            action: function() {
                setTimeout(() => {
                    app.players[0].position += 5;
                    app.scrollToPlayer();
                    game.nextPlayerButtons();
                }, 1000);
                return "Rücke 5 Felder vor";
            }
        },
        {// 61
            action: function() {
                app.players[0].changeLuck(0.2);
                game.nextPlayerButtons();
                return "Du hast jetzt etwas mehr Glück beim Würfeln";
            }
        },
        {// 62
            action: function() {
                app.players[0].changeLuck(-0.1);
                game.nextPlayerButtons();
                return "Du hast jetzt etwas weniger Glück beim Würfeln";
            }
        },
        {// 63
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 64
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        game.nextPlayerButtons();
                        app.game.text = "Du trinkst 2";
                    }, text: "Ich hab durst"},
                    {action: ()=>{
                        app.players[0].position -= 3;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                        app.game.text = "Du gehst 3 Felder zurück";
                    },text: "Ich will zurück"}];
                return "Trink 2 oder gehe 3 Felder zurück";
            }
        },
        {// 65
            action: function() {
                setTimeout(() => {
                    app.players[0].position -= 6;
                    app.scrollToPlayer();
                    game.nextPlayerButtons();
                }, 1000);
                return "Gehe 6 Felder zurück";
            }
        },
        {// 66
            action: function() {
                setTimeout(() => {
                    app.players[0].position += 2;
                    app.scrollToPlayer();
                    game.nextPlayerButtons();
                }, 1000);
                return "Gehe 2 Felder vor und trinke";
            }
        },
        {// 67
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 68
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 69
            action: function() {
                setTimeout(() => {
                    app.game.text = "Bestimme einen der 2 trinken soll"
                    game.nextPlayerButtons();
                }, 1000);
                return "Bestimme einen der 69 trinken soll";
            }
        },
        {// 70
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 71
            action: function() {
                if (game.checkPenaltyLog(71)){
                    setTimeout(() => {
                        app.players[0].position = 50;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
                    }, 1000);
                    return "Gehe auf das Feld 50 und Würfel noch einmal";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 72
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 73
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 74
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 75
            action: function() {
                var bestScore = 0;
                var worstScore = 100;
                app.players.forEach(p => {
                    if(p.position > bestScore) bestScore = p.position;
                    if(p.position < bestScore) worstScore = p.position;
                });
                if(app.players[0].position == bestScore) {
                    app.players[0].changeLuck(-0.2);
                    game.nextPlayerButtons();
                    return "Du bist zu Schnell: Ab sofort hast du weniger Glück beim Würfeln";
                }
                else if(app.players[0].position == worstScore) {
                    app.players[0].changeLuck(0.4);
                    game.nextPlayerButtons();
                    return "Hier ist ein Boost: Ab sofort hast du mehr Glück beim Würfeln";
                }
                else {
                    if (Math.random()<0.5){
                        app.players[0].changeLuck(0.2);
                        game.nextPlayerButtons();
                        return "Du hast jetzt etwas mehr Glück beim Würfeln";
                    } else {
                        app.players[0].changeLuck(-0.1);
                        game.nextPlayerButtons();
                        return "Du hast jetzt etwas weniger Glück beim Würfeln";
                    }
                }
            }
        },
        {// 76
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 77
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 78
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 79
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 80
            action: function() {
                var random = Math.floor(Math.random()*(app.players.length-1))
                var player1 = random+1;
                var player2 = (random+1)%(app.players.length-1)+1;
                app.game.buttons =  [{action: ()=>{
                        app.players[player1].changeLuck(-0.1);
                        game.nextPlayerButtons();
                        app.game.text = app.players[player1].name+" hat jetzt weniger Glück";
                    }, text: app.players[player1].name},
                    {action: ()=>{
                        app.players[player2].changeLuck(-0.1);
                        game.nextPlayerButtons();
                        app.game.text = app.players[player2].name+" hat jetzt weniger Glück";
                    },text: app.players[player2].name}];
                return "Wähle wer ab jetzt weniger Glück beim Würfeln hat";
            }
        },
        {// 81
            action: function() {
                if (game.checkPenaltyLog(81)){
                    setTimeout(() => {
                        app.players[0].position = 69;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1000);
                    return "Gehe auf Feld 69 zurück";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 82
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 83
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 84
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 85
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 86
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 87
            action: function() {
                if (game.checkPenaltyLog(87)){
                    app.game.buttons = [{action: async ()=>{
                            game.disableButtons();
                            var result = (await game.rollDiceAnimation(app.players[0].luck)*2);
                            app.players[0].position -= result;
                            app.game.text = "Du gehst "+result+" Felder zurück"
                            app.scrollToPlayer();
                            game.nextPlayerButtons();
                        },text: app.text.rollDice}];
                    return "Würfel. Du gehst die doppelte Augenzahl nach hinten";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 88
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 89
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 90
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 91
            action: function() {
                if (game.checkPenaltyLog(91)){
                    setTimeout(() => {
                        app.players[0].position = 85;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1000);
                    return "Gehe auf Feld 85 zurück";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 92
            action: function() {
                if (game.checkPenaltyLog(92)){
                    setTimeout(() => {
                        app.players[0].position = 80;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1000);
                    return "Gehe auf Feld 80 zurück";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 93
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 94
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 95
            action: function() {
                game.nextPlayerButtons();
                return app.drawCard()();
            }
        },
        {// 96
            action: function() {
                if (game.checkPenaltyLog(96)){
                    setTimeout(() => {
                        app.players[0].position = 69;
                        app.scrollToPlayer();
                        game.nextPlayerButtons();
                    }, 1000);
                    return "Gehe auf Feld 69 zurück";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 97
            action: function() {
                game.nextPlayerButtons();
                return "Nicht mehr weit! Konzentrier dich: alle außer dir trinken";
            }
        },
        {// 98
            action: function() {
                if (game.checkPenaltyLog(98)){
                    app.game.buttons = [{action: async ()=>{
                            game.disableButtons();
                            var result = await game.rollDiceAnimation(app.players[0].luck);
                            app.players[0].position -= result;
                            app.game.text = "Du gehst "+result+" Felder zurück"
                            app.scrollToPlayer();
                            game.nextPlayerButtons();
                        },text: app.text.rollDice}];
                    return "Würfel und gehe die Anzahl der Augen zurück";
                } else {
                    game.nextPlayerButtons();
                    return "Diesmal musst du nicht zurück";
                }
            }
        },
        {// 99
            action: function() {
                setTimeout(() => {
                    app.game.text += "\nTrinken reicht, du hast es fast ;)"
                    game.nextPlayerButtons();
                }, 2500);
                return "Trinke und gehe auf START zurück";
            }
        },
        {// 100
            action: function() {
                confetti.start();
                setTimeout(()=>{confetti.stop();}, 5000);
                app.resetSave();
                app.game.buttons = [{action: app.resetGame, text: "Nochmal"}];
                return  "Herzlichen Glückwunsch "+app.players[0].name+",\n"+
                        "du hast tatsächlich gewonnen!🎉 "+
                        "Wenn es dir gefallen hat, "+
                        "<a href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=F6WZ5B8PS5YU4' style='color: #4691ee; text-decoration: underline;'>spendier mir doch auch ein Bier</a>🍺";
            },
            color: "#b68f0e"
        },
    ],
    stacks: stacks
}