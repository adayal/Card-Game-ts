import { Player } from "./player";

export class PlayerManager {
    players: Player[];

    constructor() {
        this.players = [];
    }

    getPlayer(socket: any): any {
        let foundPlayer = this.players.find(player => player.getSocketId() == socket.id);
        return foundPlayer ? foundPlayer : null;
    }

    getIndexOfPlayer(socket: any): number {
        let player = this.getPlayer(socket)
        if (!player) return -1;
        return this.players.indexOf(player);
    }

    addPlayer(socket: any, playerName: string): boolean {
        if (!this.getPlayer(socket)) {
            this.players.push(new Player(socket, playerName, this.players.length))
            return true;
        }
        return false;
    }

    getPlayerByNumber(playerNumber: number): Player | any {
        return playerNumber >= this.players.length ? null : this.players[playerNumber];
    }

    removePlayer(socket: any): boolean {
        let index = this.getIndexOfPlayer(socket);
        if (index == -1)
            return false;
        this.players.splice(index, 1);
        return true;
    }

    resetAllHands() {
        this.players.forEach(x => {
            x.clearHand();
        });
    }

    resetAllStates() {
        this.players.forEach(x => {
            x.resetPlayerState();
        });
    }

    tallyPoints() {
        let sum = 0;
        this.players.forEach(x => {
            sum += x.getPoints();
        });
        return sum;
    }

    sendToAllPlayers(msgType: string, msg: any) {
        this.players.forEach(x => {
            x.sendToPlayer(msgType, msg);
        });
    }
}