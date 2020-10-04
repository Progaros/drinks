var app = new Vue({
    el: "#app",
    data: data,
    mounted() {
        this.show.loadingScreen = false;
        if (!debugging && localStorage.getItem("lastTime")) { // show restoreProgress if lastPlayed < 10h
            try {
                var lastTime = JSON.parse(localStorage.getItem('lastTime'));
                if ((Date.now()-lastTime)/1000/60/60 < 10)
                    if (localStorage.getItem("playerList")){
                        this.slideUpInfos.push({
                            text: this.text.restoreProgress,
                            yes: function() {
                                    app.slideUpInfos.splice(0, 1);
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
                                    app.slideUpInfos.splice(0, 1);
                                    app.resetSave();
                                }
                        });
                    }
            } catch(e) {
                console.error(e);
                localStorage.removeItem('lastTime');
            }
        }
    },
    methods: methods,
    computed: computed,
    components: {
        addPlayersListItem: addPlayersListItem,
        gameField: gameField
    }
});