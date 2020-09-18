var app = new Vue({
    el: "#app",
    data: data,
    mounted() {
        if (localStorage.getItem("lastTime")) { // show restoreProgress if lastPlayed < 10h
            try {
                var lastTime = JSON.parse(localStorage.getItem('lastTime'));
                if ((Date.now()-lastTime)/1000/60/60 < 10)
                    if (localStorage.getItem("playerList")){
                        this.slideUpInfos.push({
                            text: this.text.restoreProgress,
                            yes: function() {
                                    if (app.slideUpInfos.indexOf(this) > -1)
                                        app.slideUpInfos.splice(app.slideUpInfos.indexOf(this), 1)
                                    if (localStorage.getItem("playerList")) {
                                        try {
                                            app.playerList = JSON.parse(localStorage.getItem('playerList'));
                                        } catch(e) {
                                            alert("an error occured");
                                            console.error(e);
                                            localStorage.removeItem('playerList');
                                        }
                                    }
                                },
                            no: function() {
                                    if (app.slideUpInfos.indexOf(this) > -1)
                                        app.slideUpInfos.splice(app.slideUpInfos.indexOf(this), 1)
                                    app.resetSave();
                                }
                        });
                    }
            } catch(e) {
                console.error(e);
                localStorage.removeItem('lastTime');
            }
        }
      this.show.loadingScreen = false;
    },
    methods: methods,
    computed: computed,
    components: {
        addPlayersListItem: addPlayersListItem,
        gameField: gameField
    },
    watch: watch
});