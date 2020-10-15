var watch;
//if (debugging) {
    watch = {
        gameText: function(newVal) {
            console.log("%cText: %c" + newVal + " (Feld " + app.players[0].position + ")", "color: yellow", "");
            console.log();
        },
        gameButtons: function(newVal) {
            var buttons = "";
            newVal.forEach(element => {
                if (element.text.length > 0)
                    buttons += "%c" + element.text;
            });
            console.log("%cButtons: " + buttons, "color: yellow", "padding: 2px 3px; border: 2px solid #666; border-radius: 5px;");
        }
    }
//}