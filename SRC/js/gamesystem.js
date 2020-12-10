import { Player } from './player.js'
import { Game } from './game.js'


export class GameSystem {
    constructor() {
        this.players = []
        this.game = new Game();
        this.eventsLog = [];
    }

    createPlayers(numPlayers) {
        for (let i = 0; i < numPlayers; i++) {
            this.players.push(new Player());
        }
    }

    update() {

    }

    receiveEvent(message) {
        let data = JSON.parse(message.data);
        
        if (data.type == "game") {
            this.receiveGameUpdate(data.content);
        }
        else if (data.type == "player") {
            this.receivePlayerUpdate(data.content, data.playerId);
        }
    }

    receiveSystemUpdate(data) {
        this.players = []

        for (let p in data.players) {
            let newPlayer = new Player();
            newPlayer.receiveUpdate(data.players[p]);
            this.players.push(newPlayer);
        }

        this.game.receiveUpdate(data.game);
    }

    receiveGameUpdate(data) {
        this.game.receiveUpdate(data);
    }

    receivePlayerUpdate(data, playerNum) {
        this.players[playerNum].receiveUpdate(data);
    }
}
