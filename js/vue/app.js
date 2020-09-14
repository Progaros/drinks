var app = new Vue({
    el: "#app",
    data: data,
    mounted() {
        if (localStorage.getItem("playerList")) {
            try {
                this.playerList = JSON.parse(localStorage.getItem('playerList'));
            } catch(e) {
                console.error(e);
                localStorage.removeItem('playerList');
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