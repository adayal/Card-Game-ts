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
            this.players.push(new Player(socket, playerName))
            return true;
        }
        return false;
    }

    removePlayer(socket: any): boolean {
        let index = this.getIndexOfPlayer(socket);
        if (index == -1)
            return false;
        this.players.splice(index, 1);
        return true;
    }
}