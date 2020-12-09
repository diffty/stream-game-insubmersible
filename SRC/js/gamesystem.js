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

    receiveSystemUpdate(data) {
        this.players = []

        for (let p in data.players) {
            let newPlayer = new Player();
            newPlayer.receiveUpdate(p);
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
