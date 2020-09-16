var app = new Vue({
    el: "#app",
    data: data,
    mounted() {
        if (localStorage.getItem("lastTime")) { // show restoreProgress if lastPlayed < 10h
            try {
                var lastTime = JSON.parse(localStorage.getItem('lastTime'));
                if ((Date.now()-lastTime)/1000/60/60 < 10)
                    if (localStorage.getItem("playerList")){
                        this.slideUpInfoYes = function() {
                            app.show.slideUpInfo = false;
                            if (localStorage.getItem("playerList")) {
                                try {
                                    app.playerList = JSON.parse(localStorage.getItem('playerList'));
                                } catch(e) {
                                    alert("an error occured");
                                    console.error(e);
                                    localStorage.removeItem('playerList');
                                }
                            }
                        }
                        this.slideUpInfoNo = function() {
                            app.show.slideUpInfo = false;
                            app.resetSave();
                        }
                        this.text.slideUpInfo = this.text.restoreProgress;
                        this.show.slideUpInfo = true;
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