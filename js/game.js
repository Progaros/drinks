var game = {
    rollDice: async function() {
        document.getElementById("dice").style.display = "inline";
        app.game.buttons = [{action: ()=>{}, text: app.text.rollDice}];// block the button while rolling
        var position = app.players[0].position += await game.rollDiceAnimation(app.players[0].luck);
        if (position > (game.fields.length-1))
            position = app.players[0].position = game.fields.length-1;
        document.getElementById("gameField"+position).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
        app.game.text = game.fields[position].action();
        if (game.fields[position].customButtons !== true)
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
            var timeout = Math.pow(time,1.5)*7;
            if (debugging)
                timeout = 0;
            setTimeout(() => {
                resolve(game.rollDiceAnimation(luck, time, number));
            }, timeout);
          });
    },
    nextPlayer: function() {
        document.getElementById("dice").style.display = "none";
        app.players.push(
            app.players.splice(0,1)[0] //next player
        );
        app.scrollToPlayer();
        app.saveGame();
        app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
        app.game.text = app.text.pressRollDice;
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
            },
            customButtons: true
        },
        {// 2
            action: function() {
                return app.drawCard()();
            }
        },
        {// 3
            action: function() {
                if (Math.random() < 0.5){
                    setTimeout(() => {
                        app.players[0].position += 2;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1000);
                    return "Gehe 2 Felder vor";
                } else {
                    setTimeout(() => {
                        app.players[0].position -= 2;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1000);
                    return "Gehe 2 Felder zurück";
                }
            },
            customButtons: true
        },
        {// 4
            action: function() {
                return app.drawCard()();
            }
        },
        {// 5
            action: function() {
                if (Math.random() < 0.5){
                    setTimeout(() => {
                        app.players[0].position = 21;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1000);
                    return "Du gehst auf Feld 21";
                } else {
                    setTimeout(() => {
                        app.players[0].position = 12;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1000);
                    return "Du gehst auf Feld 12";
                }
            },
            customButtons: true
        },
        {// 6
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        app.players[0].changeLuck(0.3);
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Gute Entscheidung ;)";
                    }, text: "Klingt gut"},
                    {action: ()=>{
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Dann eben nicht";
                    },text: "Brauche ich nicht"}];
                return "Angebot: Trinke jetzt 5 und du hast für das gesamte Spiel mehr Glück beim Würfeln";
            },
            customButtons: true
        },
        {// 7
            action: function() {
                return app.drawCard()();
            }
        },
        {//8
            action: function() {
                return app.drawCard()();
            }
        },
        {// 9
            action: function() {
                app.game.buttons =  [
                    {action: ()=>{
                        app.players[0].position += 10;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Deine Entscheidung...";
                    },text: "10 Felder"},
                    {action: ()=>{
                        app.players[0].changeLuck(0.3);
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Deine Entscheidung...";
                    }, text: "Glück"}
                ];
                return "Wähle: Gehe jetzt 10 Felder vor oder du hast für das gesamte Spiel mehr Glück beim Würfeln";
            },
            customButtons: true
        },
        {// 10
            action: function() {
                app.players[0].changeLuck(0.2);
                return "Du hast jetzt etwas mehr Glück beim Würfeln";
            }
        },
        {// 11
            action: function() {
                return app.drawCard()();
            }
        },
        {// 12
            action: function() {
                return app.drawCard()();
            }
        },
        {// 13
            action: function() {
                return app.drawCard()();
            }
        },
        {// 14
            action: function() {
                return app.drawCard()();
            }
        },
        {// 15
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du trinst 3";
                    }, text: "Ich hab durst"},
                    {action: ()=>{
                        app.players[0].position -= 3;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du gehst 3 Felder zurück";
                    },text: "Ich will zurück"}];
                return "Trink 3 oder gehe 3 Felder zurück";
            },
            customButtons: true
        },
        {// 16
            action: function() {
                return app.drawCard()();
            }
        },
        {// 17
            action: function() {
                app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
                return "Du darfst nochmal würfeln";
            },
            customButtons: true
        },
        {// 18
            action: function() {
                if (game.checkPenaltyLog(18)){
                    app.game.buttons = [{action: async ()=>{
                        app.game.text = "Trinke " + await game.rollDiceAnimation(app.players[0].luck);
                        app.players[0].position = 0;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    },text: app.text.rollDice}];
                    return "Würfel nochmal. Trink so viel wie du Augen gewürfelt hast und gehe auf START";
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
        },
        {// 19
            action: function() {
                var bestScore = 0;
                var bestPlayer = "";
                app.players.forEach(p => {if(p.position > bestScore) bestScore=p.position});
                app.players.forEach(p => {if(p.position == bestScore) bestPlayer+=p.name+", "});
                bestPlayer = bestPlayer.substring(0, bestPlayer.length-2);
                return "Es trinkt die Person, die dem Ziel am nächsten ist ("+bestPlayer+")";
            }
        },
        {// 20
            action: function() {
                return app.drawCard()();
            }
        },
        {// 21
            action: function() {
                app.players[0].changeLuck(0.2);
                return "Du hast jetzt etwas mehr Glück beim Würfeln";
            }
        },
        {// 22
            action: function() {
                return app.drawCard()();
            }
        },
        {// 23
            action: function() {
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
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = app.players[player1].name+" hat jetzt mehr Glück";
                    }, text: app.players[player1].name},
                    {action: ()=>{
                        app.players[player2].changeLuck(0.2);
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = app.players[player2].name+" hat jetzt mehr Glück";
                    },text: app.players[player2].name}];
                return "Wähle wer ab jetzt mehr Glück beim Würfeln hat";
            },
            customButtons: true
        },
        {// 25
            action: function() {
                return app.drawCard()();
            }
        },
        {// 26
            action: function() {
                app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
                return "Du darfst nochmal würfeln und dabei einmal trinken";
            },
            customButtons: true
        },
        {// 27
            action: function() {
                if (game.checkPenaltyLog(27)){
                    setTimeout(() => {
                        app.players[0].position -= 10;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1500);
                    return "Gehe 10 Felder zurück";
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
        },
        {// 28
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        app.game.text = "Trinke " + (Math.ceil(await game.rollDiceAnimation(app.players[0].luck)/2));
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    },text: app.text.rollDice}];
                return "Würfel nochmal. Trinke die halbe Augenzahl";
            },
            customButtons: true
        },
        {// 29
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        var result = (await game.rollDiceAnimation(app.players[0].luck))*2;
                        app.players[0].position += result;
                        app.game.text = "Du gehst "+result+" Felder nach vorne"
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    },text: app.text.rollDice}];
                return "Würfel. Du gehst die doppelte Augenzahl nach vorne";
            },
            customButtons: true
        },
        {// 30
            action: function() {
                return app.drawCard()();
            }
        },
        {// 31
            action: function() {
                return app.drawCard()();
            }
        },
        {// 32
            action: function() {
                return app.drawCard()();
            }
        },
        {// 33
            action: function() {
                return app.drawCard()();
            }
        },
        {// 34
            action: function() {
                return app.drawCard()();
            }
        },
        {// 35
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du trinkst 3";
                    }, text: "Ich hab durst"},
                    {action: ()=>{
                        app.players[0].position -= 6;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du gehst 6 Felder zurück";
                    },text: "Ich will zurück"}];
                return "Trink 3 oder gehe 6 Felder zurück";
            },
            customButtons: true
        },
        {// 36
            action: function() {
                return app.drawCard()();
            }
        },
        {// 37
            action: function() {
                return app.drawCard()();
            }
        },
        {// 38
            action: function() {
                app.game.buttons =  [{action: ()=>{
                    app.players[0].position += 3;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    app.game.text = "Du gehst 3 Felder vor";
                }, text: "VORWÄRTS!"},
                {action: ()=>{
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    app.game.text = "Du darfst das nächste Mal Trinken überspringen";
                },text: "Ich hab Zeit..."}];
            return "Gehe jetzt 3 Felder vor oder überspringe das nächste mal Trinken";
            },
            customButtons: true
        },
        {// 39
            action: function() {
                return app.drawCard()();
            }
        },
        {// 40
            action: function() {
                return app.drawCard()();
            }
        },
        {// 41
            action: function() {
                return app.drawCard()();
            }
        },
        {// 42
            action: function() {
                return app.drawCard()();
            }
        },
        {// 43
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        var result = (await game.rollDiceAnimation(app.players[0].luck));
                        if (result%2 == 0){
                            app.game.text = app.players[0].name+" trinkt"
                        }
                        else {
                            app.game.text = "Die andern trinken";
                        }
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    },text: app.text.rollDice}];
                return "Würfel. Bei gerader Zahl trinkst du, bei ungerader der Rest";
            },
            customButtons: true
        },
        {// 44
            action: function() {
                return app.drawCard()();
            }
        },
        {// 45
            action: function() {
                return app.drawCard()();
            }
        },
        {// 46
            action: function() {
                return app.drawCard()();
            }
        },
        {// 47
            action: function() {
                return app.drawCard()();
            }
        },
        {// 48
            action: function() {
                return app.drawCard()();
            }
        },
        {// 49
            action: function() {
                if (game.checkPenaltyLog(49)){
                    setTimeout(() => {
                        app.players[0].position = 36;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1000);
                    return "Du gehst auf Feld 36";
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
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
                    return "Du bist zu Schnell: Ab sofort hast du weniger Glück beim Würfeln";
                }
                else if(app.players[0].position == worstScore) {
                    app.players[0].changeLuck(0.4);
                    return "Hier ist ein Boost: Ab sofort hast du mehr Glück beim Würfeln";
                }
                else {
                    if (Math.random()<0.5){
                        app.players[0].changeLuck(-0.1);
                        return "Du hast jetzt etwas mehr Glück beim Würfeln";
                    } else{
                        app.players[0].changeLuck(0.2);
                        return "Du hast jetzt etwas weniger Glück beim Würfeln";
                    }
                }
            }
        },
        {// 51
            action: function() {
                return app.drawCard()();
            }
        },
        {// 52
            action: function() {
                app.players[0].changeLuck(-0.1);
                return "Du hast jetzt etwas weniger Glück beim Würfeln";
            }
        },
        {// 53
            action: function() {
                return app.drawCard()();
            }
        },
        {// 54
            action: function() {
                return app.drawCard()();
            }
        },
        {// 55
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        var result = await game.rollDiceAnimation(app.players[0].luck);
                        app.players[0].position -= result;
                        app.game.text = "Du gehst "+result+" Felder zurück"
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    },text: app.text.rollDice}];
                return "Würfel. Du gehst die Anzahl der Augen zurück";
            },
            customButtons: true
        },
        {// 56
            action: function() {
                return app.drawCard()();
            }
        },
        {// 57
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        app.game.text = "Du darfst " + await game.rollDiceAnimation(app.players[0].luck) + "verteilen";
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    },text: app.text.rollDice}];
                return "Würfel nochmal. Verteile die Augenzahl in Schlucken";
            },
            customButtons: true
        },
        {// 58
            action: function() {
                return app.drawCard()();
            }
        },
        {// 59
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        app.players[0].position += 3;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du gehst 3 Felder vor";
                    }, text: "VORWÄRTS!"},
                    {action: ()=>{
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du darfst das nächste Mal Trinken überspringen";
                    },text: "Ich hab Zeit..."}];
                return "Gehe jetzt 3 Felder vor oder überspringe das nächste Mal Trinken";
            },
            customButtons: true
        },
        {// 60
            action: function() {
                setTimeout(() => {
                    app.players[0].position += 5;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Rücke 5 Felder vor";
            },
            customButtons: true
        },
        {// 61
            action: function() {
                app.players[0].changeLuck(0.2);
                return "Du hast jetzt etwas mehr Glück beim Würfeln";
            }
        },
        {// 62
            action: function() {
                app.players[0].changeLuck(-0.1);
                return "Du hast jetzt etwas weniger Glück beim Würfeln";
            }
        },
        {// 63
            action: function() {
                return app.drawCard()();
            }
        },
        {// 64
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du trinkst 2";
                    }, text: "Ich hab durst"},
                    {action: ()=>{
                        app.players[0].position -= 3;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du gehst 3 Felder zurück";
                    },text: "Ich will zurück"}];
                return "Trink 2 oder gehe 3 Felder zurück";
            },
            customButtons: true
        },
        {// 65
            action: function() {
                setTimeout(() => {
                    app.players[0].position -= 6;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Gehe 6 Felder zurück";
            },
            customButtons: true
        },
        {// 66
            action: function() {
                setTimeout(() => {
                    app.players[0].position += 2;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Gehe 2 Felder vor und trinke";
            },
            customButtons: true
        },
        {// 67
            action: function() {
                return app.drawCard()();
            }
        },
        {// 68
            action: function() {
                return app.drawCard()();
            }
        },
        {// 69
            action: function() {
                setTimeout(() => {
                    app.game.text = "Bestimme einen der 2 trinken soll"
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Bestimme einen der 69 trinken soll";
            },
            customButtons: true
        },
        {// 70
            action: function() {
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
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
        },
        {// 72
            action: function() {
                return app.drawCard()();
            }
        },
        {// 73
            action: function() {
                return app.drawCard()();
            }
        },
        {// 74
            action: function() {
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
                    return "Du bist zu Schnell: Ab sofort hast du weniger Glück beim Würfeln";
                }
                else if(app.players[0].position == worstScore) {
                    app.players[0].changeLuck(0.4);
                    return "Hier ist ein Boost: Ab sofort hast du mehr Glück beim Würfeln";
                }
                else {
                    if (Math.random()<0.5){
                        app.players[0].changeLuck(0.2);
                        return "Du hast jetzt etwas mehr Glück beim Würfeln";
                    } else{
                        app.players[0].changeLuck(-0.1);
                        return "Du hast jetzt etwas weniger Glück beim Würfeln";
                    }
                }
            }
        },
        {// 76
            action: function() {
                return app.drawCard()();
            }
        },
        {// 77
            action: function() {
                return app.drawCard()();
            }
        },
        {// 78
            action: function() {
                return app.drawCard()();
            }
        },
        {// 79
            action: function() {
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
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = app.players[player1].name+" hat jetzt weniger Glück";
                    }, text: app.players[player1].name},
                    {action: ()=>{
                        app.players[player2].changeLuck(-0.1);
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = app.players[player2].name+" hat jetzt weniger Glück";
                    },text: app.players[player2].name}];
                return "Wähle wer ab jetzt weniger Glück beim Würfeln hat";
            },
            customButtons: true
        },
        {// 81
            action: function() {
                if (game.checkPenaltyLog(81)){
                    setTimeout(() => {
                        app.players[0].position = 69;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1000);
                    return "Gehe auf Feld 69 zurück";
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
        },
        {// 82
            action: function() {
                return app.drawCard()();
            }
        },
        {// 83
            action: function() {
                return app.drawCard()();
            }
        },
        {// 84
            action: function() {
                return app.drawCard()();
            }
        },
        {// 85
            action: function() {
                return app.drawCard()();
            }
        },
        {// 86
            action: function() {
                return app.drawCard()();
            }
        },
        {// 87
            action: function() {
                if (game.checkPenaltyLog(87)){
                    app.game.buttons = [{action: async ()=>{
                            var result = (await game.rollDiceAnimation(app.players[0].luck)*2);
                            app.players[0].position -= result;
                            app.game.text = "Du gehst "+result+" Felder zurück"
                            app.scrollToPlayer();
                            app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        },text: app.text.rollDice}];
                    return "Würfel. Du gehst die doppelte Augenzahl nach hinten";
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
        },
        {// 88
            action: function() {
                return app.drawCard()();
            }
        },
        {// 89
            action: function() {
                return app.drawCard()();
            }
        },
        {// 90
            action: function() {
                return app.drawCard()();
            }
        },
        {// 91
            action: function() {
                if (game.checkPenaltyLog(91)){
                    setTimeout(() => {
                        app.players[0].position = 85;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1000);
                    return "Gehe auf Feld 85 zurück";
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
        },
        {// 92
            action: function() {
                if (game.checkPenaltyLog(92)){
                    setTimeout(() => {
                        app.players[0].position = 80;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1000);
                    return "Gehe auf Feld 80 zurück";
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
        },
        {// 93
            action: function() {
                return app.drawCard()();
            }
        },
        {// 94
            action: function() {
                return app.drawCard()();
            }
        },
        {// 95
            action: function() {
                return app.drawCard()();
            }
        },
        {// 96
            action: function() {
                if (game.checkPenaltyLog(96)){
                    setTimeout(() => {
                        app.players[0].position = 69;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    }, 1000);
                    return "Gehe auf Feld 69 zurück";
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
        },
        {// 97
            action: function() {
                return "Nicht mehr weit! Konzentrier dich: alle außer dir trinken";
            }
        },
        {// 98
            action: function() {
                if (game.checkPenaltyLog(98)){
                    app.game.buttons = [{action: async ()=>{
                            var result = await game.rollDiceAnimation(app.players[0].luck);
                            app.players[0].position -= result;
                            app.game.text = "Du gehst "+result+" Felder zurück"
                            app.scrollToPlayer();
                            app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        },text: app.text.rollDice}];
                    return "Würfel und gehe die Anzahl der Augen zurück";
                } else
                return "Diesmal musst du nicht zurück";
            },
            customButtons: true
        },
        {// 99
            action: function() {
                setTimeout(() => {
                    app.game.text += "\nTrinken reicht, du hast es fast ;)"
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 2500);
                return "Trinke und gehe auf START zurück";
            },
            customButtons: true
        },
        {// 100
            action: function() {
                confetti.start();
                setTimeout(()=>{confetti.stop();}, 5000);
                app.resetSave();
                app.game.buttons = [{action: app.resetGame, text: "Nochmal"}];
                return  "Herzlichen Glückwunsch "+app.players[0].name+",\n"+
                        "du hast tatsächlich gewonnen!🎉"+
                        "Wenn es dir gefallen hat,"+
                        "<a href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=F6WZ5B8PS5YU4' style='color: #4691ee; text-decoration: underline;'>spendiere mir doch auch ein Bier</a>🍺";
            },
            customButtons: true,
            color: "#b68f0e"
        },
    ],
    stacks: stacks
}