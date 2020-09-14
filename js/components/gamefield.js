var gameField = {
    props: ["number", "players-array"],
    computed: {
        content: function() {
            return this.number==0 ? "Start" : this.number;
        },
        players: function() {
            return this.playersArray.filter(
                function filterPosition(element) {
                    return element.position == this;}, 
                this.number).slice().reverse();
        }
    },
    template: `<div class="gameField">
                    <div class="gameFieldText">{{ content }}</div>
                    <div class="playerContainer">
                        <div
                            v-for="(player, index) in players"
                            :key="index"
                            :style="'background-color:'+players[index].color"
                            class="player">
                        </div>
                    </div>
                </div>`
}