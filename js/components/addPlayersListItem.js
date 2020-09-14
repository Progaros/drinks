var addPlayersListItem = {
    props: ["player-text","player-list","player","index"],
    computed: {
        backgroundColor: function() {
            var player = this.playerList[this.index];
            if (player != undefined && player.color != undefined)
                return "background-color: " + player.color;
            return "";
        }
    },
    template: `<div>
                    <input
                        :placeholder="playerText + ' ' + (index+1)"
                        v-model="playerList[index].name"
                        type="text"
                        class="addPlayersListItem"
                        @keydown.enter="$emit('next-players-list-item')">
                    <img
                        @click="$emit('delete-players-list-item',index)"
                        src="img/plus.svg"
                        alt="x"
                        :style="backgroundColor"
                        class="removePlayersListButton">
                </div>`
}