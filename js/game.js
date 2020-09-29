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
            setTimeout(() => {
                resolve(game.rollDiceAnimation(luck, time, number));
            }, Math.pow(time,1.5)*7); //TODO x^2
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
                return "Du und deine beiden Sitznachbarn Trinken";
            }
        },
        {// 3
            action: function() {
                setTimeout(() => {
                    app.players[0].position -= 2;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Gehe 2 Felder zurück";
            },
            customButtons: true
        },
        {// 4
            action: function() {
                return "Ein Spieler deiner Wahl Trinkt";
            }
        },
        {// 5
            action: function() {
                setTimeout(() => {
                    app.players[0].position = 21;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Du gehts auf Feld 21";
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
                return "Angebot: Trinke jetzt 5 und du hast für das gesammte Spiel mehr Glück beim Würfeln";
            },
            customButtons: true
        },
        {// 7
            action: function() {
                return "Jeder, der meint nicht betrunken zu sein, trinkt";
            }
        },
        {//8
            action: function() {
                return "Endlich kannst du wieder Trinken";
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
                return "Wähle: Gehe jetzt 10 Felder vor oder du hast für das gesammte Spiel mehr Glück beim Würfeln";
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
                return "Alle trinken";
            }
        },
        {// 12
            action: function() {
                return "Alle Mädls Trinken";
            }
        },
        {// 13
            action: function() {
                return "Verteile 3 Schlucke an eine Person, oder Trink selbst 1";
            }
        },
        {// 14
            action: function() {
                return "Alle, die keine Uhr tragen, Trinken";
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
                return "Alle Singels trinken";
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
                app.game.buttons = [{action: async ()=>{
                        app.game.text = "Trinke " + await game.rollDiceAnimation(app.players[0].luck);
                        app.players[0].position = 0;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    },text: app.text.rollDice}];
                return "Würfel nochmal. Trink so viel wie du Augen gewürfelt hast und gehe auf START";
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
                return "Es Trinkt die Person, die dem Ziel am nächsten ist ("+bestPlayer+")";
            }
        },
        {// 20
            action: function() {
                return "Trinke 5 Schlucke, wenn du Alkohol nicht verträgst";
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
                return "Spiele einmal Wahrheit oder Pflicht";
            }
        },
        {// 23
            action: function() {
                return "Alle Jungs trinken";
            }
        },
        {// 24
            action: function() {
                return "Die Nächste Person, die trinken muss, verteilt 2 Schlucke";
            }
        },
        {// 25
            action: function() {
                return "Nichts. Hier passiert einfach gar nichts";
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
                setTimeout(() => {
                    app.players[0].position -= 10;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1500);
                return "Gehe 10 Felder zurück";
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
                return "Bestimme einen der Trinken soll";
            }
        },
        {// 31
            action: function() {
                return "Trink so viel wie du Gewürfelt hast";
            }
        },
        {// 32
            action: function() {
                return "Verteile so viele Schlucke, wie Spieler anwesend sind";
            }
        },
        {// 33
            action: function() {
                return "Trinke, wenn du Geschwister hast";
            }
        },
        {// 34
            action: function() {
                return "Trinke 2, wenn es noch vor Mitternacht ist";
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
                return "Endlich kannst DU Trinken";
            }
        },
        {// 37
            action: function() {
                return "Alle wählen den nüchternsten Spieler, der muss exen";
            }
        },
        {// 38
            action: function() {
                app.game.buttons =  [{action: ()=>{
                    app.players[0].position += 3;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    app.game.text = "Du gehtst 3 Felder vor";
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
                return "Der Spieler mit dem schwächsten Getränk trinkt.";
            }
        },
        {// 40
            action: function() {
                return "Trinke für jeden Buchstaben deines Namens (" +
                app.players[0].name.length + ")";
            }
        },
        {// 41
            action: function() {
                return "Du und die Person links neben dir nennen ihren Lieblingsfilm. Die anderen stimmen ab. Derjenige mit dem schlechteren Film muss trinken";
            }
        },
        {// 42
            action: function() {
                return "Dein Gegenüber und du schauen sich in die Augen. Wer zuerst lacht, trinkt";
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
                return "Du bist jetzt einmal Daumenmaster. Wenn du irgendwann deinen Daumen an die Tischkante legst, müssen es dir alle gleich tun. Der letzte trinkt 2";
            }
        },
        {// 45
            action: function() {
                return "Trinke, wenn du ein Appleprodukt besitzt";
            }
        },
        {// 46
            action: function() {
                return "Du leerst dein Glas bis zur Hälfte";
            }
        },
        {// 47
            action: function() {
                return "Die Person links von der Person, die diese Regel vorliest, trinkt 2";
            }
        },
        {// 48
            action: function() {
                return "Bewege dich nicht, bis du das nächste Mal dran bist";
            }
        },
        {// 49
            action: function() {
                setTimeout(() => {
                    app.players[0].position = 36;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Du gehts auf Feld 36";
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
                return "Du sagst etwas wie <i>\"Derjenige, der als erstes ... machen würde\"</i>. Alle zeigen mit geschlossenen Augen auf die Person, auf die es am ehesten zutrifft. Derjenige mit den meisten Stimmen muss trinken";
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
                return "Du trinkst doppelt für eine Runde";
            }
        },
        {// 54
            action: function() {
                return "Trink so viel, wie du gewürfelt hast";
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
                return "Du und die Person, die du hier am längsten kennst, trinken";
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
                return "Trinke mit allen, die du heute erst kennengelernt hast";
            }
        },
        {// 59
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        app.players[0].position += 3;
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du gehtst 3 Felder vor";
                    }, text: "VORWÄRTS!"},
                    {action: ()=>{
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du darfst das nächste Mal Trinken überspringen";
                    },text: "Ich hab Zeit..."}];
                return "Gehe jetzt 3 Felder vor oder überspringe das nächste mal Trinken";
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
                return "Die nächste Person, die den Raum verlassen will, muss zuerst austrinken";
            }
        },
        {// 64
            action: function() {
                app.game.buttons =  [{action: ()=>{
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                        app.game.text = "Du trinst 2";
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
                return "Du wählst ein verbotenes Wort. Jeder, der es ab jetzt benutzt, muss trinken";
            }
        },
        {// 68
            action: function() {
                return "Mache 10 Liegestütze. Trinke für jede, die du nicht schaffst";
            }
        },
        {// 69
            action: function() {
                setTimeout(() => {
                    app.game.text = "Bestimme einen der 2 Trinken soll"
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Bestimme einen der 69 Trinken soll";
            },
            customButtons: true
        },
        {// 70
            action: function() {
                return "Verteil so viele Schlucke, wie du heute alkoholische Getränke hattest";
            }
        },
        {// 71
            action: function() {
                setTimeout(() => {
                    app.players[0].position = 50;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.rollDice, text: app.text.rollDice}];
                }, 1000);
                return "Gehe auf das Feld 50 und Würfel noch einmal";
            },
            customButtons: true
        },
        {// 72
            action: function() {
                return "Erzähle wo und wann du den Spieler zu deiner Linken getroffen hast";
            }
        },
        {// 73
            action: function() {
                return "Der erste und letzte Spieler spielen \"Schere, Stein, Papier\" um 3 Schlucke";
            }
        },
        {// 74
            action: function() {
                return "Das Mädchen (oder der Junge) mit der Größten Oberweite trinkt";
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
                return "Alle, die nach Beginn des Spiels dazugestoßen sind, trinekn 3";
            }
        },
        {// 77
            action: function() {
                return "Trinke, wenn du du das vorliest";
            }
        },
        {// 78
            action: function() {
                return "Denke an eine Zahl zwischen 1 und 10. Im Uhrzeigersinn versucht jeder die Zahl zu erraten. Der erste, der richtig liegt, wählt jemanden, der trinken muss.";
            }
        },
        {// 79
            action: function() {
                return "Spielt einmal \"Ich hab noch nie\"";
            }
        },
        {// 80
            action: function() {
                return "Wenn du gerade etwas auf dem Kopf trägst, trinke!";
            }
        },
        {// 81
            action: function() {
                setTimeout(() => {
                    app.players[0].position = 69;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Gehe auf Feld 69 zurück";
            },
            customButtons: true
        },
        {// 82
            action: function() {
                return "Alle Raucher trinken 2";
            }
        },
        {// 83
            action: function() {
                return "Glückwunsch, du darfst trinken!";
            }
        },
        {// 84
            action: function() {
                return "Die letzte Person die Aufsteht, muss 3 Schlucke trinken";
            }
        },
        {// 85
            action: function() {
                return "Du trinkst einmal, dein linker Nachbar 2x, dessen Nachbar 3x, usw. Einmal im Kreis";
            }
        },
        {// 86
            action: function() {
                return "Die Person mit dem härtesten Alkohol im Glas verteilt an so viele Spieler wie sie will einen Schluck";
            }
        },
        {// 87
            action: function() {
                app.game.buttons = [{action: async ()=>{
                        var result = (await game.rollDiceAnimation(app.players[0].luck)*2);
                        app.players[0].position -= result;
                        app.game.text = "Du gehst "+result+" Felder zurück"
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    },text: app.text.rollDice}];
                return "Würfel. Du gehst die doppelte Augenzahl nach hinten";
            },
            customButtons: true
        },
        {// 88
            action: function() {
                return "Mach ein Selfie mit der Person zu deiner Rechten";
            }
        },
        {// 89
            action: function() {
                return "Die Person, die dir als nächstes in die Augen sieht, trinkt";
            }
        },
        {// 90
            action: function() {
                return "Verteile 5 Schlucke, wenn du noch nie geraucht hast";
            }
        },
        {// 91
            action: function() {
                setTimeout(() => {
                    app.players[0].position = 85;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Gehe auf Feld 85 zurück";
            },
            customButtons: true
        },
        {// 92
            action: function() {
                setTimeout(() => {
                    app.players[0].position = 80;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Gehe auf Feld 80 zurück";
            },
            customButtons: true
        },
        {// 93
            action: function() {
                return "Stell dich auf ein Bein und trinke";
            }
        },
        {// 94
            action: function() {
                return "Wenn du jetzt dein Glas leerst, darfst du 5 verteilen";
            }
        },
        {// 95
            action: function() {
                return "Die Person, die zuerst ein Kleidungsstück ausgezogen hat, verteilt 5 Schlucke (Socken etc. zählen nicht)";
            }
        },
        {// 96
            action: function() {
                setTimeout(() => {
                    app.players[0].position = 69;
                    app.scrollToPlayer();
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 1000);
                return "Gehe auf Feld 69 zurück";
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
                app.game.buttons = [{action: async ()=>{
                        var result = await game.rollDiceAnimation(app.players[0].luck);
                        app.players[0].position -= result;
                        app.game.text = "Du gehst "+result+" Felder zurück"
                        app.scrollToPlayer();
                        app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                    },text: app.text.rollDice}];
                return "Würfel und gehe die Anzahl der Augen zurück";
            },
            customButtons: true
        },
        {// 99
            action: function() {
                setTimeout(() => {
                    app.game.text += "\nTrinken reicht, du hast es fast ;)"
                    app.game.buttons = [{action: game.nextPlayer, text: app.text.nextPlayer}];
                }, 2500);
                return "Trink und gehe auf START zurück";
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
    ]
}